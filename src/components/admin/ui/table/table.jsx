import "./table.css";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Importa los estilos de Skeleton

const UITable = ({ columns, data, isLoading, renderActions }) => {
    return (
        <div className="tableContainer">
            <table className="blogTable">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length + 1}>
                                <Skeleton />
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <td key={col}>
                                        {col === "Status" ? (
                                            <span className={`statusBadge ${row.status}`}>{row.status}</span>
                                        ) : col === "Fecha de Creacion" ? (
                                            new Date(row.createdAt).toLocaleDateString()
                                        ) : col === "Estado" ? (
                                            <span className={`activoBadge ${row.activo ? "activo" : "inactivo"}`}>
                                                {row.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        ) : (
                                            row[col.toLowerCase()] // Accede dinámicamente a los valores
                                        )}
                                    </td>

                                ))}
                                <td>{renderActions(row)}</td> {/* Renderiza los botones de acciones */}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UITable;
