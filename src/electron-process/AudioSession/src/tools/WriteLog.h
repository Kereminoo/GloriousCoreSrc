#pragma once

#ifdef _WIN32
#include <atlstr.h>
#endif

#include <string_view>

void DebugOnOff(bool on = false);
void WriteLog(std::string_view const &msg, int state = 0);
