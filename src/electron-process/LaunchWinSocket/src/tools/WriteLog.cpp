#include "WriteLog.h"

#include <filesystem>
#include <fstream>

#ifdef _WIN32
#include <chrono>
#include <format>
#else
#include <ctime>
#endif

namespace {
bool g_saveDebug = false;
} // namespace

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

void WriteLog(std::string_view const &msg, int const state = 0) {
#ifdef _WIN32
  auto       now       = std::chrono::system_clock::now();
  auto       localTime = std::chrono::current_zone()->to_local(now);
  auto const message   = std::format("{:%T} :: {}", localTime, msg);
#else
  time_t      now = time(0);
  struct tm   tstruct;
  std::string buf;
  buf.reserve(80);
  tstruct = *localtime(&now);
  strftime(&buf[0], buf.capacity(), "%Y-%m-%d.%X", &tstruct);
  auto const        message   = buf + " :: " + std::string(msg);
#endif

  // day + path
  auto logPath = std::filesystem::current_path();
  if (logPath.empty()) {
    logPath = std::filesystem::temp_directory_path();
  }
#ifdef _WIN32
  logPath /= std::filesystem::path(std::format("{:%Y%m%d}_SyncProgram.log", localTime));
#else
  std::string const filename  = buf + "_SyncProgram.log";
  logPath                    /= filename;
#endif

  WriteLogToFile(logPath, message, state);
}
