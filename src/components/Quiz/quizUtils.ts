
import { UserType, QuizQuestion } from './types';
import { initialQuestions } from './quizData';

export const getFilteredQuestions = (userType: UserType): QuizQuestion[] => {
  if (userType === null) {
    return [initialQuestions[0]];
  }
  
  return initialQuestions.filter(q => 
    q.forUserType === userType || q.forUserType === 'both'
  );
};

export const sendToWebhook = async (formData: any) => {
  try {
    const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/4813340d-f86b-46d7-a82a-39db8631e043";
    
    // Use fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout
    
    // Instead of using URL parameters which can be problematic with large data,
    // let's send data in the request body as JSON
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
    
    console.log('Webhook response:', await response.text());
    return true;
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    // Instead of throwing, we'll return a formatted error object
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error sending data to webhook'
    };
  }
};
