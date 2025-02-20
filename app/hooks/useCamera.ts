import { useState, useCallback } from 'react';
import { supportAgent } from '@/agent/SupportAgent';
import { SearchKnowledge } from '@/agent/tools/SearchKnowledge';

export const useCamera = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCameraToggle = useCallback(() => {
    setShowCamera(prev => !prev);
  }, []);

  const handleCameraResult = async (result: string) => {
    setIsProcessing(true);

    if (!result || result.trim() === "") {
      console.log("OCR did not detect any text from camera");
      setIsProcessing(false);
      return;
    }

    console.log("OCR detected text from camera: ", result);

    try {
        const searchTool = new SearchKnowledge();
        const searchResults = await searchTool.run({ question: result });
        console.log("Knowledge base results:", searchResults);
        
        if (!searchResults || searchResults.length === 0) {
          await supportAgent.safeTextSend(
            "I couldn't find any matching information for this image text in our knowledge base. Could you please verify the text is clear and complete? Suggest they can use the camera again, speak the text, or type it out."
          );
        } else {
          // Send results to agent without displaying in chat
          await supportAgent.safeTextSend(
            `I've identified the following from the camera: "${result}"`
          );
          
          // Log results for debugging
          console.log("Knowledge base results:", searchResults);
        }
      } catch (error) {
        console.error('Error processing camera result:', error);
        await supportAgent.safeTextSend(
          "I encountered an error while searching our knowledge base."
        );
      } finally {
        setIsProcessing(false);
        setShowCamera(false);
      }
    };

  return {
    showCamera,
    isProcessing,
    handleCameraToggle,
    handleCameraResult
  };
};