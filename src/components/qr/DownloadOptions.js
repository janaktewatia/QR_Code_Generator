// src/components/qr/DownloadOptions.jsx
import React, { useState } from "react";
import { useQR } from "../../context/QRContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import {
  FiDownload,
  FiPrinter,
  FiCopy,
  FiShare2,
  FiPackage,
} from "react-icons/fi";

const DownloadOptions = () => {
  const { qrData, currentQRImage, setLoading } = useQR();
  const [downloading, setDownloading] = useState(false);
  const [activeFormat, setActiveFormat] = useState("png");

  const downloadAsPNG = async () => {
    setActiveFormat("png");
    setDownloading(true);
    try {
      const canvas = await getQRCanvas();
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("QR Code downloaded as PNG!");
    } catch (error) {
      toast.error("Failed to download PNG");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsJPG = async () => {
    setActiveFormat("jpg");
    setDownloading(true);
    try {
      const canvas = await getQRCanvas();
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();
      toast.success("QR Code downloaded as JPG!");
    } catch (error) {
      toast.error("Failed to download JPG");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsSVG = async () => {
    setActiveFormat("svg");
    setDownloading(true);
    try {
      const qrElement = document.querySelector(".qr-canvas canvas");
      if (qrElement) {
        const svgData = new XMLSerializer().serializeToString(qrElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.download = `qrcode-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("QR Code downloaded as SVG!");
      }
    } catch (error) {
      toast.error("Failed to download SVG");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setDownloading(true);
    try {
      const canvas = await getQRCanvas();
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 100;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (pdf.internal.pageSize.width - imgWidth) / 2;
      const y = (pdf.internal.pageSize.height - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`qrcode-${Date.now()}.pdf`);
      toast.success("QR Code downloaded as PDF!");
    } catch (error) {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAllFormats = async () => {
    setDownloading(true);
    try {
      await downloadAsPNG();
      setTimeout(() => downloadAsJPG(), 500);
      setTimeout(() => downloadAsSVG(), 1000);
      setTimeout(() => downloadAsPDF(), 1500);
      toast.info("Downloading all formats...");
    } catch (error) {
      toast.error("Failed to download all formats");
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const copyToClipboard = async () => {
    try {
      const canvas = await getQRCanvas();
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        toast.success("QR Code copied to clipboard!");
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const printQR = async () => {
    try {
      const canvas = await getQRCanvas();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              img { max-width: 80%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL()}" />
            <script>window.onload = () => { window.print(); window.close(); }<\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      toast.error("Failed to print");
    }
  };

  const getQRCanvas = async () => {
    const qrElement = document.querySelector(".qr-canvas canvas");
    if (qrElement) {
      return qrElement;
    }
    throw new Error("QR element not found");
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        const canvas = await getQRCanvas();
        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({
          title: "My QR Code",
          text: "Check out this QR code I created!",
          files: [file],
        });
        toast.success("Shared successfully!");
      } catch (error) {
        toast.error("Share cancelled or failed");
      }
    } else {
      toast.info("Web Share API not supported. Download the QR code instead.");
    }
  };

  return (
    <div className="download-options">
      <div className="d-grid gap-2">
        <div className="btn-group gap-2">
          <button
            className={`btn ${activeFormat === "png" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={downloadAsPNG}
            disabled={downloading}
          >
            PNG
          </button>
          <button
            className={`btn ${activeFormat === "jpg" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={downloadAsJPG}
            disabled={downloading}
          >
            JPG
          </button>
          <button
            className={`btn ${activeFormat === "svg" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={downloadAsSVG}
            disabled={downloading}
          >
            SVG
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={downloadAsPDF}
            disabled={downloading}
          >
            PDF
          </button>
        </div>

        <div className="btn-group gap-2">
          <button
            className="btn btn-secondary"
            onClick={copyToClipboard}
            disabled={downloading}
          >
            <FiCopy className="me-2" /> Copy Image
          </button>
          <button
            className="btn btn-secondary"
            onClick={shareQR}
            disabled={downloading}
          >
            <FiShare2 className="me-2" /> Share
          </button>
          <button
            className="btn btn-secondary"
            onClick={printQR}
            disabled={downloading}
          >
            <FiPrinter className="me-2" /> Print
          </button>
        </div>
      </div>

      {downloading && (
        <div className="mt-3 text-center">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="visually-hidden">Downloading...</span>
          </div>
          <span className="ms-2">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;
