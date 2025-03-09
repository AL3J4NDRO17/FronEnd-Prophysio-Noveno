import "./Steps.css"

export function Steps({ steps, currentStep }) {
  return (
    <div className="steps-container">
      <div className="steps">
        {steps.map((step, index) => (
          <div key={step.id} className={`step ${index <= currentStep ? "active" : ""}`}>
            <div className="step-number">{step.id}</div>
            <div className="step-content">
              <div className="step-title">{step.name}</div>
              <div className="step-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

