// src/pages/QRGeneratorPage.jsx
import React, { useState } from "react";
import {
  BiGlobe,
  BiText,
  BiEnvelope,
  BiPhone,
  BiMessageSquare,
  BiLogoWhatsapp,
  BiWifi,
  BiIdCard,
} from "react-icons/bi";
import { useQR } from "../context/QRContext";
import QRPreview from "../components/qr/QRPreview";
import QRCustomizer from "../components/qr/QRCustomizer";
import LogoUploader from "../components/qr/LogoUploader";
import DownloadOptions from "../components/qr/DownloadOptions";
import URLForm from "../components/forms/URLForm";
import TextForm from "../components/forms/TextForm";
import EmailForm from "../components/forms/EmailForm";
import PhoneForm from "../components/forms/PhoneForm";
import SMSForm from "../components/forms/SMSForm";
import WhatsAppForm from "../components/forms/WhatsAppForm";
import WiFiForm from "../components/forms/WiFiForm";
import VCardForm from "../components/forms/VCardForm";

const QRGeneratorPage = () => {
  const { qrData, updateQRData, loading } = useQR();
  const [activeTab, setActiveTab] = useState("url");

  const contentTypes = [
    { id: "url", name: "Website URL", icon: BiGlobe },
    { id: "text", name: "Plain Text", icon: BiText },
    { id: "email", name: "Email", icon: BiEnvelope },
    { id: "phone", name: "Phone", icon: BiPhone },
    { id: "sms", name: "SMS", icon: BiMessageSquare },
    { id: "whatsapp", name: "WhatsApp", icon: BiLogoWhatsapp },
    { id: "wifi", name: "WiFi", icon: BiWifi },
    { id: "vcard", name: "vCard", icon: BiIdCard },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "url":
        return <URLForm />;
      case "text":
        return <TextForm />;
      case "email":
        return <EmailForm />;
      case "phone":
        return <PhoneForm />;
      case "sms":
        return <SMSForm />;
      case "whatsapp":
        return <WhatsAppForm />;
      case "wifi":
        return <WiFiForm />;
      case "vcard":
        return <VCardForm />;
      default:
        return <URLForm />;
    }
  };

  return (
    <div className="container-fluid p-1 fade-in">
      <div className="row">
        <div className="col-12 mb-3">
          <h1 className="display-6 fw-bold">QR Code Generator</h1>
          <p className="text-muted mb-0">
            Create stunning, customized QR codes in seconds
          </p>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-5">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setActiveTab(type.id);
                          updateQRData({
                            type: type.id,
                            value: "",
                            email: "",
                            subject: "",
                            body: "",
                            phoneNumber: "",
                            message: "",
                            ssid: "",
                            password: "",
                            encryption: "WPA",
                            hidden: false,
                            fullName: "",
                            phone: "",
                            organization: "",
                            title: "",
                            website: "",
                            address: "",
                          });
                        }}
                        className={`btn d-flex align-items-center gap-2 ${activeTab === type.id ? "btn-primary" : "btn-outline-secondary"}`}
                      >
                        <Icon
                          className={`fs-5 ${activeTab === type.id ? "text-white" : "text-secondary"}`}
                        />
                        {type.name}
                      </button>
                    );
                  })}
                </div>

                <div className="ms-3" style={{ minWidth: 220, maxWidth: 360 }}>
                  <LogoUploader />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-5 mb-4">
            <div className="card-body p-4">{renderForm()}</div>
          </div>

          <div className="card shadow-sm border-0 rounded-5 mb-4">
            <div className="card-body p-4">
              <QRCustomizer />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div
            className="card shadow-sm border-0 rounded-5 sticky-top"
            style={{ top: "20px" }}
          >
            <div className="card-body p-4 text-center">
              <QRPreview />
              <hr className="my-4" />
              <DownloadOptions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorPage;
