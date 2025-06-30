"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { CheckCircle, XCircle,CreditCard,Wallet } from "lucide-react" // Importamos iconos de Lucide React
import { toast } from "react-toastify"

export default function PaymentOptionStep({ onNext, onPrev, formData, onFormChange, loading }) {
  const paypalRef = useRef()
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'error', 'loading', null
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null) // 'paypal', 'cash'

  // Sincronizar el método de pago seleccionado con el formData inicial
  useEffect(() => {
    if (formData.metodo_pago) {
      setSelectedPaymentMethod(formData.metodo_pago.toLowerCase())
    }
  }, [formData.metodo_pago])

  useEffect(() => {
    // Cargar el script del SDK de PayPal solo si PayPal está seleccionado
    if (selectedPaymentMethod === "paypal" && !window.paypal) {
      const script = document.createElement("script")
      // IMPORTANTE: Reemplaza 'YOUR_PAYPAL_CLIENT_ID' con tu ID de cliente de PayPal real.
      // Para desarrollo, puedes usar tu ID de cliente de sandbox.
      script.src = `https://www.paypal.com/sdk/js?client-id=AS7XZvvU0nsES6J4d24WBxHWglHe_tMUxawTT2QleUwpdJh8cNw53dgdCHWMj8wZa52H7EosDePRjkb4&currency=USD`
      script.onload = () => {
        if (window.paypal) {
          window.paypal
            .Buttons({
              createOrder: (data, actions) => {
                setPaymentStatus("loading")
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "10.00", // Monto de ejemplo. Puedes hacerlo dinámico.
                      },
                    },
                  ],
                })
              },
              onApprove: (data, actions) => {
                return actions.order
                  .capture()
                  .then((details) => {
                    setPaymentStatus("success")
                    onFormChange("metodo_pago", "PayPal") // Actualiza el formData
                    toast.success("¡Pago con PayPal completado!")
                    // Aquí es donde normalmente enviarías los detalles de la transacción a tu backend
                    // para verificar y registrar el pago de forma segura.
                  })
                  .catch((err) => {
                    setPaymentStatus("error")
                    console.error("Error al capturar el pago:", err)
                    toast.error("Error al procesar el pago con PayPal.")
                  })
              },
              onError: (err) => {
                setPaymentStatus("error")
                console.error("Error de PayPal:", err)
                toast.error("Ocurrió un error con PayPal.")
              },
            })
            .render(paypalRef.current)
        }
      }
      document.body.appendChild(script)

      return () => {
        // Limpiar el script cuando el componente se desmonte
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }
  }, [selectedPaymentMethod]) // Depende de selectedPaymentMethod

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method)
    // Si se selecciona "cash", actualiza el formData inmediatamente
    if (method === "cash") {
      onFormChange("metodo_pago", "Efectivo/Al finalizar")
      setPaymentStatus(null) // Resetear estado de pago si se cambia a efectivo
    } else {
      onFormChange("metodo_pago", "") // Limpiar si se cambia a PayPal y aún no se ha pagado
    }
  }

  const handleNext = () => {
    if (selectedPaymentMethod === "paypal") {
      if (paymentStatus === "success") {
        onNext()
      } else {
        toast.error("Por favor, complete el pago con PayPal para continuar.")
      }
    } else if (selectedPaymentMethod === "cash") {
      onNext()
    } else {
      toast.error("Por favor, seleccione un método de pago para continuar.")
    }
  }

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Opciones de Pago</CardTitle>
        <p className="payment-card-description">Selecciona tu método de pago preferido.</p>
      </CardHeader>
      <CardContent className="payment-card-content">
        <div className="payment-method-selection">
          <button
            className={`payment-method-button ${selectedPaymentMethod === "paypal" ? "selected" : ""}`}
            onClick={() => handleSelectPaymentMethod("paypal")}
            disabled={loading}
          >
            <CreditCard className="h-6 w-6" />
            Pagar con PayPal
          </button>
          <button
            className={`payment-method-button ${selectedPaymentMethod === "cash" ? "selected" : ""}`}
            onClick={() => handleSelectPaymentMethod("cash")}
            disabled={loading}
          >
            <Wallet className="h-6 w-6" />
            Pagar al finalizar la cita
          </button>
        </div>

        {selectedPaymentMethod === "paypal" && (
          <div className="paypal-section">
            <h3>Pagar con PayPal</h3>
            <p>Monto a pagar: $10.00 USD</p>
            <div ref={paypalRef} className="paypal-button-container">
              {paymentStatus === "loading" && <p>Cargando botón de PayPal...</p>}
              {paymentStatus === "error" && !window.paypal && (
                <p className="error-message">Hubo un error al cargar el botón de PayPal. Intenta de nuevo.</p>
              )}
            </div>
            {paymentStatus === "success" && (
              <div className="confirmation-status-message success">
                <CheckCircle className="confirmation-icon success-icon" />
                <p>¡Pago realizado con éxito!</p>
              </div>
            )}
            {paymentStatus === "error" && (
              <div className="confirmation-status-message error">
                <XCircle className="confirmation-icon error-icon" />
                <p>Error al procesar el pago. Por favor, inténtalo de nuevo.</p>
              </div>
            )}
          </div>
        )}

        {selectedPaymentMethod === "cash" && (
          <div className="payment-info-message">
            <p>
              Has seleccionado pagar al finalizar la cita. El pago se realizará directamente en la clínica. Asegúrate de
              tener el monto listo.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            loading || (selectedPaymentMethod === "paypal" && paymentStatus !== "success") || !selectedPaymentMethod
          }
        >
          Siguiente
        </Button>
      </CardFooter>
    </Card>
  )
}
