import 'webrtc-adapter';
import { useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';

const CameraStream: React.FC<{ onResult: (result: string) => void }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const handleLoadedMetadata = () => {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => { 
          video.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
    }

    const interval = setInterval(async () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.filter = 'contrast(1.2) brightness(1.1)';
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        try {
          const { data: { text } } = await Tesseract.recognize(
            dataUrl,
            'eng+swe',
            {
              logger: m => console.log('OCR Progress: ', m)
            }
          );

          if (text && text.trim() !== '') {
            console.log('OCR Text Detected:', text);
            onResult(text.trim());  // Send text back to parent
          }
        } catch (error) {
          console.error('OCR Error:', error);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onResult]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-96 h-72" style={{ display: 'block' }} playsInline autoPlay /> { /* make sure Video element is visible */}
      <canvas ref={canvasRef} className="hidden" width={680} height={420} /> { /* this was 1280x640 */} 
    </div>
  );
};

export default CameraStream;