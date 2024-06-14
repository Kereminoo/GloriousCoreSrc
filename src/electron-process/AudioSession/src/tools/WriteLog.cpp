#include "WriteLog.h"

#include <filesystem>
#include <fstream>

#ifdef __APPLE__
#include <sstream>
#include <iomanip>
#include <chrono>
#endif

namespace {
bool g_saveDebug = false;
}

void DebugOnOff(bool on) {
  g_saveDebug = on;
}

void WriteLogToFile(std::filesystem::path const &path, std::string_view const &msg, int const state) {
  if (g_saveDebug) {
    auto const    mode = (state == 0) ? std::ios::app : std::ios::out;
    std::ofstream log(path, mode);
    log << msg << std::endl;
  }
}

#ifdef _WIN32
void WriteLog(std::string_view const &Msg, int state) {
  auto now       = std::chrono::system_clock::now();
  auto localTime = std::chrono::current_zone()->to_local(now);
  auto message   = std::format("{:%T} :: {}", localTime, Msg);

  // day + path
  auto logPath   = std::filesystem::current_path();
  if (logPath.empty()) {
    logPath = std::filesystem::temp_directory_path();
  }
  logPath /= std::filesystem::path(std::format("{:%Y%m%d}_AUDIO.log", localTime));

  WriteLogToFile(logPath, message, state);
}

void WriteLogCString(CString const &Msg, int state) {
  WriteLog(Msg.GetString(), state);
}

#elif __APPLE__

void WriteLog(std::string_view const &Msg, int state) {
  auto now = std::chrono::system_clock::now();
  auto now_c = std::chrono::system_clock::to_time_t(now);
  std::tm localTime;
  localtime_r(&now_c, &localTime);

  std::ostringstream oss;
  oss << std::put_time(&localTime, "%T") << " :: " << Msg;
  auto message = oss.str();

  // day + path
  auto logPath = std::filesystem::current_path();
  if (logPath.empty()) {
    logPath = std::filesystem::temp_directory_path();
  }

  oss.str("");
  oss.clear();
  oss << std::put_time(&localTime, "%Y%m%d") << "_AUDIO.log";
  logPath /= oss.str();

  WriteLogToFile(logPath, message, state);
}
#endif
