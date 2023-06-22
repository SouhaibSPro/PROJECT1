import React, { useEffect, useRef } from 'react';
import './App.css';

const SoundVisualization = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    let animationFrameId;
    let isPlaying = true;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(238, 200, 205, 1)');
      gradient.addColorStop(1, 'rgba(200, 238, 233, 1)');
    
      // Apply the gradient as the background of the canvas
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      const iconSize = 80;
      const iconX = (canvas.width - iconSize) / 2;
      const iconY = (canvas.height - iconSize) / 2;

      canvasCtx.fillStyle = 'rgb(150, 150, 150)';
      canvasCtx.beginPath();
      if (isPlaying) {
        // Draw pause icon
        canvasCtx.fillRect(iconX, iconY, 20, iconSize);
        canvasCtx.fillRect(iconX + 50, iconY, 20, iconSize);
      } else {
        // Draw play icon
        canvasCtx.moveTo(iconX, iconY);
        canvasCtx.lineTo(iconX + iconSize, iconY + iconSize / 2);
        canvasCtx.lineTo(iconX, iconY + iconSize);
        canvasCtx.closePath();
        canvasCtx.fill();
      }
    };
    
    const togglePlay = () => {
      if (!isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      isPlaying = !isPlaying;
    };
    draw();
    canvas.addEventListener('click', togglePlay);

    // Clear the canvas before starting the animation loop
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Start drawing

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioRef.current.pause();
      audioRef.current.src = process.env.PUBLIC_URL + '/mixkit-game-show-suspense-waiting-667.mp3';
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className='song'/>
      
      <audio ref={audioRef} src="path/to/audio-file.mp3" autoPlay />
    </div>
  );
};

export default SoundVisualization;