import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ConfirmedTasks = ({ confirmedTasks, cancelTask }) => {
  const downloadFormattedPDF = (task) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("DEVIS / QUOTATION", 14, 20);

    doc.setFontSize(10);
    doc.text(task.entrepriseNom, 14, 30);
    doc.text(task.entrepriseAdresse, 14, 35);
    doc.text(task.entreprisePhone + " / " + task.entrepriseEmail, 14, 40);

    doc.text("Nom du client:", 140, 30);
    doc.text(task.nomClient, 140, 35);
    doc.text(task.clientAdresse, 140, 40);
    doc.text(task.clientPhone + " / " + task.clientEmail, 140, 45);

    doc.setFont("helvetica", "bold");
    doc.text("Objet :", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.text(task.object, 30, 60);

    autoTable(doc, {
      startY: 70,
      head: [["Description", "Unité", "Quantité", "Prix Unitaire HT", "TVA", "Total HT"]],
      body: [[
        task.object,
        "1",
        task.quantite,
        `${task.prix} €`,
        "20%",
        `${(parseFloat(task.prix) * parseInt(task.quantite)).toFixed(2)} €`
      ]]
    });

    const baseY = doc.lastAutoTable.finalY + 10;
    doc.text("Montant Total HT: " + `${(parseFloat(task.prix) * parseInt(task.quantite)).toFixed(2)} €`, 140, baseY);
    doc.text("TVA (20%): " + `${(parseFloat(task.prix) * parseInt(task.quantite) * 0.2).toFixed(2)} €`, 140, baseY + 5);
    doc.text("Montant TTC: " + `${(parseFloat(task.prix) * parseInt(task.quantite) * 1.2).toFixed(2)} €`, 140, baseY + 10);

    doc.setFontSize(8);
    doc.text(
      "Conditions de règlement : Paiement à 30 jours. Retard = indemnité forfaitaire de 40€.",
      14,
      280
    );

    doc.save(`devis-${task.id}.pdf`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tâches Confirmées</h2>
      {confirmedTasks.length === 0 ? (
        <p>Aucune tâche confirmée.</p>
      ) : (
        <ul className="space-y-3">
          {confirmedTasks.map((task) => (
            <li key={task.id} className="p-3 rounded border bg-green-100 shadow">
              <p className="font-semibold">Nom: {task.nomClient}</p>
              <p>Objet: {task.object}</p>
              <p>Quantité: {task.quantite}</p>
              <p>Prix: {task.prix} €</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => downloadFormattedPDF(task)}
                  className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Télécharger PDF
                </button>
                <button
                  onClick={() => cancelTask(task)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Annuler
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConfirmedTasks;
