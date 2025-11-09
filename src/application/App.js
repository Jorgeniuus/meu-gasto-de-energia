import { useState } from 'react';
import styled from '@emotion/styled';
import './App.css';

const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  padding: '8px',
});

export default function App() {
  const [electricityRate, setElectricityRate] = useState(0.8);
  const [devices, setDevices] = useState([{ deviceName: "", devicePower: "", timePerDay: "" }]);
  const [results, setResults] = useState([]);

  const handleAddDevice = () => {
    setDevices([...devices, { deviceName: "", devicePower: "", timePerDay: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newDevices = [...devices];
    newDevices[index][field] = value;
    setDevices(newDevices);
  };

  const handleRemove = (indexToRemove) => {
    setDevices((prevDevices) =>
      prevDevices.filter((_, index) => index !== indexToRemove)
    );
  };

  const calcular = () => {
    const res = devices.map((device) => {
      const powerKW = device.devicePower / 1000;
      const dailyConsumption = powerKW * device.timePerDay;
      const monthlyConsumption = dailyConsumption * 30;
      const monthlyCost = monthlyConsumption * electricityRate;
      return {
        ...device,
        dailyConsumption: dailyConsumption,
        monthlyConsumption: monthlyConsumption,
        monthlyCost: monthlyCost,
      };
    });
    setResults(res);
  };

  const totalKWH = results.reduce((acc, r) => acc + r.monthlyConsumption, 0);
  const totalCusto = results.reduce((acc, r) => acc + r.monthlyCost, 0);

  return (
    <Wrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-lg">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            💡 Simulador de Consumo de Energia
          </h1>

          <table className="w-full mb-3 text-sm border border-gray-200 rounded-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Aparelho</th>
                <th className="p-2 text-left">Potência (Watts)</th>
                <th className="p-2 text-left">Horas/dia</th>
              </tr>
            </thead>
            <tbody className="inputs-space">
              {devices.map((device, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <input
                      className="border rounded w-full px-2 py-1"
                      value={device.deviceName}
                      onChange={(e) => handleChange(index, 'deviceName', e.target.value)}
                      placeholder="Nome do aparelho"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border rounded w-full px-2 py-1"
                      value={device.devicePower}
                      onChange={(e) =>
                        handleChange(index, "devicePower", Number(e.target.value))
                      }
                      placeholder="Potência do aparelho"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="border rounded w-full px-2 py-1"
                      value={device.timePerDay}
                      onChange={(e) =>
                        handleChange(index, "timePerDay", Number(e.target.value))
                      }
                      placeholder="Horas de uso diário"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="remove-button-cell w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddDevice}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-md mb-4"
          >
            + Adicionar aparelho
          </button>

          <div className="mb-3">
            <label className="text-sm font-medium">
              Tarifa de energia (R$/kWh):
            </label>
            <input
              type="number"
              step="0.01"
              className="border rounded w-full px-2 py-1 mt-1"
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
            />
          </div>

          <button
            onClick={calcular}
            className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-md font-medium"
          >
            Calcular consumo mensal
          </button>

          {results.length > 0 && (
            <div className="mt-5 text-sm">
              <h2 className="font-semibold mb-2">📊 Resultados:</h2>
              {results.map((result, index) => (
                <div key={index} className="border-t border-gray-100 py-1">
                  <p>
                    <strong>{result.deviceName || "Aparelho"}</strong> →{" "}
                    {result.monthlyConsumption.toFixed(2)}  KWH / Mês → R${" "}
                    {result.monthlyCost.toFixed(2)}
                  </p>
                </div>
              ))}
              <hr className="my-2" />
              <h2 className="font-semibold mb-2">
                💸 TOTAL:
              </h2>
              <p className="font-semibold">
                {totalKWH.toFixed(2)} KWH / Mês → 💰 R$ {totalCusto.toFixed(2)}
              </p>
              <p className="mt-3 text-yellow-700">
                💡 Dica: Diminuindo 2h/dia no aparelho mais usado você economiza
                cerca de R$ {(electricityRate * 0.002 * 30).toFixed(2)}/mês!
              </p>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

