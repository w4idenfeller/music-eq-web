import React, { useRef, useState } from "react";
import axios from "axios";

const genreEqPresets = {
  'Hip-Hop/Rap': [8,2,-2,0,2,1],
  'Jazz':        [3,4,2,1,2,3],
  'Rock':        [4,2,0,3,5,6],
  'Pop':         [5,1,-1,2,4,5],
  'Electronic':  [6,2,-2,4,7,6],
  'Dance':       [7,2,0,2,5,6],
  'Classical':   [2,1,2,3,4,5],
  'default':     [0,0,0,0,0,0]
};
const frequencies = [60, 250, 1000, 4000, 10000, 16000];

function App() {
  const [genre, setGenre] = useState("...");
  const [eq, setEq] = useState(genreEqPresets.default);
  const audioRef = useRef();

  const API_KEY = "2a45ff396e7389acdbc20b60e01cc6dd";

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    audioRef.current.src = url;
    audioRef.current.load();

    // API'ya gönder
    const formData = new FormData();
    formData.append("api_token", API_KEY);
    formData.append("file", file);
    formData.append("return", "apple_music");

    const response = await axios.post("https://api.audd.io/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // API'dan türü çek
    let genreName = "Unknown";
    try {
      const result = response.data.result;
      genreName =
        (result &&
          (result.genre ||
            (result.apple_music && result.apple_music.genre))) ||
        "Unknown";
    } catch (err) {
      genreName = "Unknown";
    }
    setGenre(genreName);

    // EQ preset uygula
    const preset = genreEqPresets[genreName] || genreEqPresets.default;
    setEq(preset);
  };

  return (
    <div style={{background: "#181818", color: "#fff", minHeight: "100vh", padding: 30}}>
      <h2>AI Müzik Türü & Otomatik EQ Demo</h2>
      <input type="file" accept="audio/*" onChange={handleFile} />
      <audio ref={audioRef} controls style={{width: "80%", marginTop: 20}} />
      <p style={{marginTop:20}}>Tahmin Edilen Tür: <b>{genre}</b></p>
      <div style={{display: "flex", gap: 20, marginTop: 30}}>
        {frequencies.map((f, i) => (
          <div key={f} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <input type="range" min={-12} max={12} value={eq[i]} readOnly style={{transform:'rotate(-90deg)', width:100}} />
            <span style={{fontSize:12, marginTop:8}}>{f} Hz</span>
            <span style={{fontSize:14}}>{eq[i]} dB</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
