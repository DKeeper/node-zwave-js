# Firmware Update Meta Data CC

## `getMetaData` method

```ts
async getMetaData(): Promise<Pick<FirmwareUpdateMetaDataCCMetaDataReport, "manufacturerId" | "firmwareId" | "checksum" | "firmwareUpgradable" | "maxFragmentSize" | "additionalFirmwareIDs" | "hardwareVersion" | "continuesToFunction" | "supportsActivation"> | undefined>;
```

Requests information about the current firmware on the device.

## `requestUpdate` method

```ts
async requestUpdate(
	options: FirmwareUpdateMetaDataCCRequestGetOptions,
): Promise<FirmwareUpdateRequestStatus>;
```

Requests the device to start the firmware update process.
WARNING: This method may wait up to 60 seconds for a reply.

## `sendFirmwareFragment` method

```ts
async sendFirmwareFragment(
	fragmentNumber: number,
	isLastFragment: boolean,
	data: Buffer,
): Promise<void>;
```

Sends a fragment of the new firmware to the device.