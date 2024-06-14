import EventEmitter from "events";

// const EventEmitter = require('events');
const evtType = require('../../others/EventVariable').EventTypes;
const execFile = require('child_process').execFile;

const LaunchWinSocket = require(`../nodeDriver/x64/LaunchWinSocket.node`);
let previousValues: any = [];
const previousValuesLength = 100;

const sleepFor = async (ms) => {
  await new Promise((exec) => setTimeout(exec, ms))
};

const timeoutPoller = async (promise, timeout, rate) => {
  let stopPolling = false;
  const timer = setTimeout(() => {
    stopPolling = true;
    console.log(`Timed out (${timeout}ms): ${promise}`);
  }, timeout);
  while (!stopPolling) {
    const result = await promise();
    if (result) {
      clearTimeout(timer);
      return result;
    }
    await sleepFor(rate);
  }
  return false;
};

const MAX_FAIL_COUNT = 500;
class ProMiceUpdate extends EventEmitter 
{
  static #instance?:ProMiceUpdate;

  #steps: any[] = [];
  #stepOneSuccess = false;

  constructor() 
  {
    super();
  }

  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    } else {
      this.#instance = new ProMiceUpdate();
      return this.#instance;
    }
  }

  initialize = (deviceInfo, SN, execData) => {
    this.#steps = this.#prepareUpdateSteps(deviceInfo, SN , execData);
    this.#stepOneSuccess = false;
  };

  updateDeviceFW = async () => {
    this.#stepOneSuccess = await this.#executeStepByIndex(0);
    if (this.#stepOneSuccess) {
      const step = this.#steps[0];
      const stepFinishedData = {
        Func: evtType.FinishedFWUpdateDeviceStep,
        SN: step.SN,
        Param: {Data: {SN: step.SN, completed: step.index, total: step.totalSteps}}
      };
      this.emit(evtType.ProtocolMessage, stepFinishedData);
      console.log(`ProMiceUpdate: Emit: Finished Launch Step ${step.index}`);
    } else {
      this.#emitFWUpdate(this.#steps[0].SN, {Data: 'FAIL'});
    }
    return this.#stepOneSuccess;
  }

  updateDongleFW = async () => {
    const success = this.#stepOneSuccess ? await this.#executeStepByIndex(1) : false;
    if (success) {
      this.#emitFWUpdate(this.#steps[0].SN, {Data: 'PASS'});
    } else {
      this.#emitFWUpdate(this.#steps[0].SN, {Data: 'FAIL'});
    }
    return success;
  }


  #executeStepByIndex = async (index) => {
    const step = this.#steps.find((x) => x.index === index);
    return step ? await this.#executeUpdateStep(step) : false;
  }

  #prepareUpdateSteps = (deviceInfo, SN, execData) => {
    return deviceInfo.FWUpdateExtension.map((elem, idx) => {
      return {
        SN: SN,
        deviceName: deviceInfo.devicename,
        executablePath: execData.execPath.replace(".zip", elem),
        deviceType: idx === 0 ? "device" : "dongle", // TODO: maybe a more robust way to determine if dongle...
        index: idx,
        stepPhases: 4,
        totalSteps: deviceInfo.FWUpdateExtension.length,
      };
    });
  };

  #emitFWUpdate = (SN, Param) => {
    const fwUpdateData = {Func: evtType.SendFWUPDATE, SN: SN, Param: Param};
    this.emit(evtType.ProtocolMessage, fwUpdateData);
  }


  #executeUpdateStep = async (updateStep) => {
    console.log(`ProMiceUpdate: Launching executable ${updateStep.executablePath}`);
    // 1: launch updater executable
    execFile(updateStep.executablePath, (error) => {
      if (error) {
        console.log(`ProMiceUpdate: Error launching FWUpdate executable: ${error}`);
      }
    });

    console.log(`ProMiceUpdate: Connecting to updater`);
    const connectedToUpdater = await timeoutPoller(() => {
      const response = LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
      return response.includes("GETPROGRESSOK");
    }, 15000, 1000);

    if (!connectedToUpdater) {
      console.log(`ProMiceUpdate: Failed to get update status from updater process!\nUpdater: ${updateStep}`);
      this.#emitFWUpdate(updateStep.SN, {Data: 'FAIL'});
      return false;
    }

    // 2: Start update
    console.log(`ProMiceUpdate: Starting Update`);
    this.#emitFWUpdate(updateStep.SN, {Data: 'START'});

    const totalProgressOnStart = updateStep.index / updateStep.totalSteps * 100;
    this.#emitFWUpdate(updateStep.SN, {Data: totalProgressOnStart.toString()});

    const startedUpdate = await timeoutPoller(() => {
      const response = LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "START");
      return !response.includes("Device Not Found");
    }, 5000, 1000);

    if (!startedUpdate) {
      const updaterResponse = LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
      console.log(`ProMiceUpdate: Failed to start update: Device Not Found!\nUpdater response: ${updaterResponse}`);
      await this.#terminateUpdaterProcess(updateStep);
      const failureEventData = {
        Data: "ERROR", deviceName: updateStep.deviceName, errorKey: updateStep.deviceType
      };
      this.#emitFWUpdate(updateStep.SN, failureEventData);
      return false;
    }

    // 3: Update in progress
    console.log(`ProMiceUpdate: Update Started`);
    let progressStatus = {
      current: 0, failedCount: 0, phase: 0,
    };
    previousValues = [];
    while (progressStatus.failedCount < MAX_FAIL_COUNT) {
      if (await this.#checkUpdateProgress(updateStep, progressStatus)) {
        return true;
      }
      await sleepFor(100)
    }

    return false;
  }

  #checkUpdateProgress = async (updateStep, progressStatus) => {
    console.log(`ProMiceUpdate: Progress check`);

    const progressResponse = LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
    if (progressResponse.includes("PASS")) {
      await this.#terminateUpdaterProcess(updateStep);
      return true;
    }

    if (progressResponse.includes("FAIL") || progressResponse.includes("Not Found ProcessName App") || progressResponse.includes("failed!")) {
      console.log(`ProMiceUpdate: checkProgressUpdate: Failed, response: ${progressResponse}`);
      await this.#terminateUpdaterProcess(updateStep);
      this.#emitFWUpdate(updateStep.SN, {Data: 'FAIL'});
      progressStatus.failedCount = MAX_FAIL_COUNT;
      return false;
    }

    const responseProgress = parseInt(progressResponse.split("GETPROGRESSOK:").pop());

    previousValues.push(responseProgress);
    if(previousValues.length > previousValuesLength)
    {
      for(let i = 0; i < previousValues.length - previousValuesLength; i++)
      {
        previousValues.shift();
      }
    }

    // if the last X values have been the same...
    if(previousValues.length == previousValuesLength && previousValues.every(value => value == previousValues[0]))
    {
      console.log("ProMiceUpdate: no progress for too long, FAIL");
      await this.#terminateUpdaterProcess(updateStep);
      this.#emitFWUpdate(updateStep.SN, {Data: 'FAIL'});
      return false;
    }

    if (progressStatus.current === responseProgress && progressStatus.failedCount >= MAX_FAIL_COUNT && responseProgress < 100) {
      // Progress hasn't changed for too long, fail
      console.log("ProMiceUpdate: no progress for too long, FAIL");
      await this.#terminateUpdaterProcess(updateStep);
      this.#emitFWUpdate(updateStep.SN, {Data: 'FAIL'});
      return false;
    }
    if (progressStatus.current === responseProgress) {
      progressStatus.failedCount++;
      return false;
    }

    if (responseProgress < progressStatus.current) {
      progressStatus.phase++;
    }

    progressStatus.current = responseProgress;
    const stepProgress = (progressStatus.phase * 100 + responseProgress) / updateStep.stepPhases;

    const totalProgress = (updateStep.index * 100 + stepProgress) / updateStep.totalSteps;
    console.log(`ProMiceUpdate: progress phase ${progressStatus.current}, step ${stepProgress}, totalProg ${totalProgress}`)
    this.#emitFWUpdate(updateStep.SN, {Data: totalProgress.toString()});
    return false;
  };

  #terminateUpdaterProcess = async (updateStep) => {
    const processName = "FirmwareUpdater";
    let terminateResponse;
    let retriesLeft = 5;
    while (retriesLeft--) {
      const findWindowResponse = LaunchWinSocket.FindWindowProcess(processName);
      if (findWindowResponse < 1) {
        // The process does not exist; success
        return `Updater process for ${updateStep.deviceName} terminated successfully`;
      }
      terminateResponse = LaunchWinSocket.TerminateProcess(processName);
      console.log("ProMiceUpdate: LaunchWinSocket TerminateProcess:", terminateResponse);
      await sleepFor(1000);
    }
    console.log(`ProMiceUpdate: Failed to terminate updater process for ${updateStep.deviceName}`);
    return terminateResponse;
  };
}

module.exports = ProMiceUpdate;
