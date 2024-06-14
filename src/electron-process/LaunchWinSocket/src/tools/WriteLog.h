#pragma once

#include <string_view>

void DebugOnOff(bool on);
void WriteLog(std::string_view const& msg);
