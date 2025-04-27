import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const TodoApp = ({ tasks, setTasks, confirmTask }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nomClient: "",
    object: "",
    quantite: "",
    prix: "",
    clientAdresse: "",
    clientEmail: "",
    clientPhone: "",
    entrepriseNom: "DIGI Al Mahata",
    entrepriseAdresse: "AlMahata rue 322",
    entreprisePhone: "07777777777",
    entrepriseEmail: "Digialmahat@gmail.com"
  });

  const toggleForm = () => setFormVisible(!formVisible);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { ...formData, id: Date.now() };
    setTasks([...tasks, newTask]);
    setFormData({
      nomClient: "",
      object: "",
      quantite: "",
      prix: "",
      clientAdresse: "",
      clientEmail: "",
      clientPhone: "",
    });
    setFormVisible(false);
  };

  const handleConfirm = (task) => {
    // downloadFormattedPDF(task);
    confirmTask(task);
  };

  const downloadFormattedPDF = (task) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("DEVIS", 14, 20);

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
      <h1 className="text-3xl font-bold mb-4">To-Do List (Client Info)</h1>

      <button
        onClick={toggleForm}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {formVisible ? "Cancel" : "Add"}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input type="text" name="nomClient" placeholder="Nom Client" value={formData.nomClient} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="clientAdresse" placeholder="Adresse Client" value={formData.clientAdresse} onChange={handleChange} className="w-full p-2 border rounded"  />
          <input type="text" name="clientPhone" placeholder="Téléphone Client" value={formData.clientPhone} onChange={handleChange} className="w-full p-2 border rounded"  />
          <input type="email" name="clientEmail" placeholder="Email Client" value={formData.clientEmail} onChange={handleChange} className="w-full p-2 border rounded"  />

          <input type="text" name="object" placeholder="Objet" value={formData.object} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="prix" placeholder="Prix unitaire" value={formData.prix} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="quantite" placeholder="Quantité" value={formData.quantite} onChange={handleChange} className="w-full p-2 border rounded" required />

          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
        </form>
      )}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 rounded border bg-white shadow">
            <p className="font-semibold">Nom: {task.nomClient}</p>
            <p>Objet: {task.object}</p>
            <p>Quantité: {task.quantite}</p>
            <p>Prix: {task.prix} €</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleConfirm(task)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Done
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
