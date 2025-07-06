"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import { XCircle,Search } from "lucide-react"
import "leaflet/dist/leaflet.css" // Importa los estilos CSS de Leaflet
import { toast } from "react-toastify" // Usar react-toastify para notificaciones
import myMarkerSvg from '../assets/map-marker-svgrepo-com.svg'; // Importa el SVG

const customMarkerIcon = new Icon({
  iconUrl: myMarkerSvg, // Aquí usas el SVG importado
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function LocationMarker({ position, setPosition }) {
  const map = useMap() // Obtener la instancia del mapa

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      map.setView(e.latlng, map.getZoom()) // Centrar el mapa en el nuevo marcador
    },
  })

  useEffect(() => {
    if (position && position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom() < 10 ? 13 : map.getZoom()) // Ajustar zoom si es muy bajo
    }
  }, [position, map])

  return position && position[0] !== 0 && position[1] !== 0 ? (
    <Marker position={position} icon={customMarkerIcon}></Marker>
  ) : null
}

export default function LocationPickerMap({ latitude, longitude, onLocationSelect }) {
  const defaultCenter = [0, 0] // Centro por defecto si no hay coordenadas iniciales
  const [currentPosition, setCurrentPosition] = useState(latitude && longitude ? [latitude, longitude] : defaultCenter)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([]) // Nuevo estado para resultados de búsqueda

  useEffect(() => {
    setCurrentPosition(latitude && longitude ? [latitude, longitude] : defaultCenter)
  }, [latitude, longitude])

  const handleSetPosition = (newPosition) => {
    setCurrentPosition(newPosition)
    onLocationSelect(newPosition[0], newPosition[1])
    setSearchResults([]) // Limpiar resultados después de seleccionar
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Por favor, introduce una dirección o lugar para buscar.")
      return
    }

    setIsSearching(true)
    setSearchResults([]) // Limpiar resultados anteriores
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`, // Limitar a 5 resultados
      )
      if (!response.ok) {
        throw new Error("Error al buscar la ubicación.")
      }
      const data = await response.json()

      if (data && data.length > 0) {
        setSearchResults(data)
        toast.success(`Se encontraron ${data.length} resultados. Selecciona uno del listado.`)
      } else {
        toast.warn("No se encontraron resultados para tu búsqueda.")
      }
    } catch (error) {
      console.error("Error en la búsqueda de geocodificación:", error)
      toast.error(error.message || "Error al buscar la ubicación. Inténtalo de nuevo.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSearchResult = (result) => {
    handleSetPosition([Number.parseFloat(result.lat), Number.parseFloat(result.lon)])
    setSearchQuery(result.display_name) // Actualizar el campo de búsqueda con el nombre completo
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    handleSetPosition(defaultCenter) // Opcional: resetear el marcador a la posición por defecto
  }

  return (
    <div className="companySettings-map-container">
      <div className="companySettings-map-search-bar">
        <input
          type="text"
          placeholder="Buscar dirección o lugar..."
          className="companySettings-input companySettings-map-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault() // <--- PREVENIR EL ENVÍO DEL FORMULARIO
              handleSearch()
            }
          }}
          disabled={isSearching}
        />
        <button
          type="button" // <--- ASEGURAR QUE ES TIPO "BUTTON"
          className="companySettings-button-primary companySettings-button-small"
          onClick={handleSearch}
          disabled={isSearching}
        >
          <Search className="companySettings-button-icon-small" />
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
        {searchQuery && ( // Mostrar botón de limpiar solo si hay texto en la búsqueda
          <button
            type="button" // <--- ASEGURAR QUE ES TIPO "BUTTON"
            className="companySettings-button-outline companySettings-button-small"
            onClick={handleClearSearch}
            disabled={isSearching}
          >
            <XCircle className="companySettings-button-icon-small" />
            Limpiar
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="companySettings-search-results">
          {searchResults.map((result) => (
            <button
              key={result.place_id}
              className="companySettings-search-result-item"
              onClick={() => handleSelectSearchResult(result)}
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      <MapContainer
        center={currentPosition}
        zoom={currentPosition === defaultCenter ? 2 : 13} // Ajusta el zoom si hay coordenadas
        scrollWheelZoom={true}
        className="companySettings-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Volver a OpenStreetMap
        />
        <LocationMarker position={currentPosition} setPosition={handleSetPosition} />
      </MapContainer>
      <div className="companySettings-map-coords-display">
        <strong>Latitud:</strong> {currentPosition[0]?.toFixed(6) || "N/A"}
        {" | "}
        <strong>Longitud:</strong> {currentPosition[1]?.toFixed(6) || "N/A"}
      </div>
    </div>
  )
}
