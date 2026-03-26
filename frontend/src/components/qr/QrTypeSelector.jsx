import { FiChevronDown } from "react-icons/fi";

function QrTypeSelector({
  qrType,
  qrTypesMain,
  qrTypesMore,
  showMoreOptions,
  setShowMoreOptions,
  onSelectType,
}) {
  return (
    <div className="qr-type-selector-wrapper">
      <div className="qr-type-selector">
        {qrTypesMain.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onSelectType(type.value)}
              className={`qr-type-btn ${qrType === type.value ? "active" : ""}`}
              title={type.label}
              aria-label={`סוג QR: ${type.label}`}
              aria-pressed={qrType === type.value}
            >
              <IconComponent className="qr-type-icon" />
              <span className="qr-type-label">{type.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="qr-type-btn more-btn"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          aria-expanded={showMoreOptions}
          aria-label="עוד סוגי QR"
        >
          <FiChevronDown
            className="qr-type-icon"
            style={{
              transform: showMoreOptions ? "rotate(180deg)" : "none",
            }}
          />
          <span className="qr-type-label">More</span>
        </button>
      </div>
      {showMoreOptions && (
        <div className="qr-more-dropdown-overlay">
          {qrTypesMore.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  onSelectType(type.value);
                  setShowMoreOptions(false);
                }}
                className={`qr-more-option ${qrType === type.value ? "active" : ""}`}
                aria-label={`סוג QR: ${type.label}`}
                aria-current={qrType === type.value ? "true" : undefined}
              >
                <IconComponent className="qr-more-icon" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QrTypeSelector;
