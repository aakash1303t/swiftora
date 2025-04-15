import React, { useEffect, useRef, useState } from 'react';
import { BarcodeReader } from 'dynamsoft-javascript-barcode';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const readerRef = useRef(null);

  useEffect(() => {
    const loadDynamsoft = async () => { 
      try {
        BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
        BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@latest/dist/";
        const reader = await BarcodeReader.createInstance();
        await reader.updateRuntimeSettings("speed");
        readerRef.current = reader;

        await startCamera();
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    loadDynamsoft();

    return () => {
      stopCamera();
      if (readerRef.current) {
        readerRef.current.destroyContext();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setScanning(true);
          requestAnimationFrame(decodeFrame);
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const decodeFrame = async () => {
    if (!scanning || !videoRef.current || !readerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const result = await readerRef.current.decode(frame);
      if (result.length > 0) {
        setResults(result);
        console.log("Scanned:", result.map(r => r.barcodeText));
      }
    } catch (err) {
      // Decoding failed (not an error, just means no barcode in frame)
    }

    requestAnimationFrame(decodeFrame);
  };

  const drawOverlay = () => {
    return results.map((result, i) => {
      const loc = result.localizationResult;
      if (!loc) return null;
      const points = `${loc.x1},${loc.y1} ${loc.x2},${loc.y2} ${loc.x3},${loc.y3} ${loc.x4},${loc.y4}`;
      return (
        <polygon
          key={i}
          points={points}
          style={{
            fill: "rgba(0,255,0,0.2)",
            stroke: "lime",
            strokeWidth: 2,
          }}
        />
      );
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 640, margin: "auto" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: 8 }}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox={`0 0 ${videoRef.current?.videoWidth || 640} ${videoRef.current?.videoHeight || 480}`}
      >
        {drawOverlay()}
      </svg>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        {results.length > 0 ? (
          results.map((res, i) => <p key={i}>Scanned: {res.barcodeText}</p>)
        ) : (
          <p>Point the camera at a barcode</p>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
