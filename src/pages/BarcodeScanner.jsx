// BarcodeScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (devices.length === 0) {
          setError("No camera devices found.");
          return;
        }

        const selectedDeviceId = devices[0].deviceId;

        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result) {
            setBarcode(result.getText());
            codeReader.reset(); // stop after one successful scan
          }
        });
      } catch (err) {
        console.error("Camera error:", err);
        setError("Failed to access camera.");
      }
    };

    startScanner();

    return () => {
      codeReader.reset(); // cleanup on unmount
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#5b2333] mb-4">Barcode Scanner</h2>

      {error && <p className="text-red-500">{error}</p>}
      <video ref={videoRef} className="w-full max-w-md rounded shadow" />

      {barcode && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <strong>Scanned Barcode:</strong> {barcode}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
