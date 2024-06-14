#pragma once

#include <cstdint>

struct HIDD_ATTRIBUTES {
  uint32_t Size;
  uint16_t  VendorID;
  uint16_t  ProductID;
  uint16_t  VersionNumber;
};

struct DEVICE_ATTRIBUTES {
  uint16_t VendorID;
  uint16_t ProductID;
  uint16_t Location;
  bool    Status;
};

struct CALLBACK_DATA {
  char Text[512];
};

using USAGE = uint16_t;
