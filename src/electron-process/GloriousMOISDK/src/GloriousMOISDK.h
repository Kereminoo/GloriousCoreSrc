#pragma once

#include <winsock2.h>
#include <windows.h>

#include <array>
#include <functional>

#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include <atlstr.h> //Use For CString

#include <tlhelp32.h>

#include <uv.h>
#include <uv_async_queue.h>

struct GloriousMOISDK_INFO{
    int Profile;
    std::string Filename;
};

/*****************************ENUM Defined Data**************************************/
enum class ButtonID {
  BUTTON_1  = 0x01,
  BUTTON_2  = 0x02,
  BUTTON_3  = 0x03,
  BUTTON_4  = 0x04,
  BUTTON_5  = 0x05,
  BUTTON_6  = 0x06,
  BUTTON_7  = 0x07,
  BUTTON_8  = 0x08,
  BUTTON_9  = 0x09,

  BUTTON_10 = 0x0A,
  BUTTON_11 = 0x0B,
  BUTTON_12 = 0x0C,
  BUTTON_13 = 0x0D,
  BUTTON_14 = 0x0E,
  BUTTON_15 = 0x0F,
  BUTTON_16 = 0x10,
  BUTTON_17 = 0x11,
  BUTTON_18 = 0x12
};

enum class FunctionID {
  KEYBOARD_KEY_FUN   = 0x10,
  MACRO_FUN          = 0x11,
  SHORTCUTS_FUN      = 0x12,
  MOUSE_BUTTON_FUN   = 0x13,
  DPI_FUN            = 0x14,
  MEDIA_FUN          = 0x15,
  DISABLE_BUTTON_FUN = 0x0A,
  SHIFT_BUTTON_FUN   = 0x0B,
};

enum class MouseFunctionID {
  LEFT_CLICK    = 0x01,
  RIGHT_CLICK   = 0x02,
  MIDDLE_CLICK  = 0x04,
  IE_BACKWARD   = 0x08,
  IE_FORWARD    = 0x10,
  SCROLL_UP     = 0x11,
  SCROLL_DOWN   = 0x12,
  TRIPLE_CLICK  = 0x13,
  FIRE_KEY      = 0x14,
  PROFILE_CYCLE = 0x15,
};

enum class DPIFunctionID {
  NEXT_CPI       = 0x00,
  PREVIOUS_CPI   = 0x01,
  NEXT_CPI_CYCLE = 0x03,
  lOCK_CPI       = 0x0A,
};

enum class MediaFunctionID {
  M_MEDIA_PLAYER = 0x01,
  M_PLAY_PAUSE   = 0x02,
  M_NEXT_TRACK   = 0x03,
  M_PREV_TRACK   = 0x04,
  M_STOP         = 0x05,
  M_VOL_MUTE     = 0x06,
  M_VOL_UP       = 0x07,
  M_VOL_DOWN     = 0x08,
};

enum class ShortcutFunctionID {
  OS_EMAIL         = 0x00,
  OS_CALCULATOR    = 0x01,
  OS_MY_PC         = 0x02,
  OS_EXPLORER      = 0x03,
  OS_IE_HOME       = 0x04,
  OS_IE_REFRESH    = 0x05,
  OS_IE_STOP       = 0x07,
  OS_IE_BACK       = 0x08,
  OS_IE_FORWARD    = 0x09,
  OS_IE_SEARCH     = 0x10,
  OS_KEYBOARD_HOME = 0x11,
  LAUNCH_PROGRAM   = 0x23,
  OPEN_FILE_LINK   = 0x24,
};

enum class HotkeyValue {
  HotKey_Ctrl  = 0x01,
  HotKey_Shift = 0x02,
  HotKey_Alt   = 0x04,
  HotKey_Win   = 0x08,
};

/*********************** Struct DATA For Model I **********************************************/
/**********************LED data****************************************/
enum class LedEffect {
  LED_OFF               = 0x00,
  GLORIOUS_MODE         = 0x01,
  SEAMLESS_BREATHING    = 0x02,
  BREATHING_RGB         = 0x04,
  BREATHING_SINGLECOLOR = 0x05,
  SINGLE_COLOR          = 0x06,
  TAIL_MODE             = 0x07,
  RAVE_MODE             = 0x13,
  WAVE_MODE             = 0x09,
  CUSTOM_COLOR          = 0x0F, // 13 individual colors
};

struct RGB {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};

struct Lighting {
  LedEffect           mode; // LED_EFFECT_T>int
  std::array<RGB, 13> led;
  uint8_t             mode_aux;
  uint8_t             brightness;
  uint8_t             speed;
  int                 sleep_timer;
};

/**********************button data****************************************/
/**********************Profile data****************************************/
enum class ProfileID : int {
  PROFILE_1 = 0x01,
  PROFILE_2 = 0x02,
  PROFILE_3 = 0x03,
};

struct PathData {
  uint8_t        path_data[6][1024];
  unsigned short data_length[6];
};

/**********************sensor data****************************************/
enum class PollingRate {
  PR_125  = 125,
  PR_250  = 250,
  PR_500  = 500,
  PR_1000 = 1000,
};

enum class AngleSnapping {
  ON  = 0x01,
  OFF = 0x00,
};

enum class LOD {
  LOW  = 0x00, // 1mm (default)
  HIGH = 0x01, // 2mm
};

struct DPI {
  unsigned short dpi_x;
  unsigned short dpi_y;
  RGB            dpi_color;
};

struct DPIGroup {
  uint8_t dpi_level_num;
  uint8_t dpi_level_current;
  DPI     dpi[6];
};

struct Performance {
  PollingRate polling_rate;
  uint8_t     button_response_time;
  LOD         lod; // LOD_T->uint8_t
  DPIGroup    dpi_t;
};

// macro & button data
struct MacroEvent {
  uint8_t        event_type;
  unsigned short action;
  uint8_t        make;
  unsigned int   delay;
};
struct Macro {
  uint8_t                    macro_id;
  unsigned short             event_number;
  uint8_t                    loop_count;
  std::array<MacroEvent, 72> event;
};

// button data
struct Button {
  ButtonID       button_id; // BUTTON_ID>int
  FunctionID     function;  // FUN_ID>int
  uint8_t        binding;   //
  unsigned short binding_aux;
  Macro          macro_t;
};

struct ButtonSettings {
  std::array<Button, 18> button_t; // 0~8:Normal key,9~17:Shift Key
};
/*********************** Struct DATA For Model I ****************************************************/

using CB_MOUSEDATA                 = long(__stdcall*)(uint8_t *function, uint8_t *button_data);
using CMI_CaptureCBData            = long(__stdcall*)(CB_MOUSEDATA);
// FIRMWARE_UPDATE Mouse

using CB_FIRMWARE_UPDATE           = int(__stdcall*)(uint8_t *, unsigned short *);
using FIRMWARE_UPDATE_PROGRESS     = int(__stdcall*)(CB_FIRMWARE_UPDATE);
//

using CB_DEVICE_CHANGE             = long(__stdcall*)(uint8_t *device_status);
using CMI_DeviceChange             = long(__stdcall*)(CB_DEVICE_CHANGE);
//
using CMI_DeviceStatus             = uint8_t(*)(unsigned short *);
using CMI_CloseDevice              = uint8_t(*)();
using CMI_GetFWVersion             = uint8_t(*)(unsigned short *);
using CMI_GetBLVersion             = uint8_t(*)(unsigned short *);
using CMI_GetDLLVersion            = BOOL(*)(unsigned short *);
//
using CMI_PerformanceSetting       = uint8_t(*)(unsigned int, Performance);
using CMI_LightingSetting          = uint8_t(*)(unsigned int, Lighting *);
using CMI_ButtonSetting            = uint8_t(*)(unsigned int, Button *);
using CMI_ALLButtonSetting         = uint8_t(*)(unsigned int, ButtonSettings *);
//
using CMI_SETCURRENTPROFILEID      = uint8_t(*)(unsigned int);
using CMI_UPDATE_FIRMWARE          = uint8_t(*)(unsigned int, uint8_t *);

using CB_FIRMWARE_UPDATE           = int(WINAPI*)(uint8_t *, unsigned short *);
using CMI_FIRMWARE_UPDATE_PROGRESS = uint8_t(*)(CB_FIRMWARE_UPDATE);

//
using CMI_Devicelistener           = int(*)();

//
using CMI_SETLEDON                 = uint8_t(*)();
using CMI_SETLEDOFF                = uint8_t(*)();
