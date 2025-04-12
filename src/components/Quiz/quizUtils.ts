
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

export interface WebhookError {
  error: true;
  message: string;
}

export const sendToWebhook = async (formData: any): Promise<boolean | WebhookError> => {
  try {
    const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/d8f5b13a-ac80-4ae5-8247-27c574036746";
    
    // Use fetch with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout
    
    // Create URL parameters for each field individually
    const params = new URLSearchParams();
    
    // Add basic user info
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('phone', formData.phone);
    params.append('userType', formData.userType);
    params.append('timestamp', formData.timestamp);
    
    // Add each answer as a separate parameter
    if (Array.isArray(formData.answers)) {
      formData.answers.forEach((answer: any, index: number) => {
        params.append(`question_${index}`, answer.question);
        params.append(`answer_${index}`, answer.answer);
      });
    }
    
    // Create the URL with parameters
    const urlWithParams = `${webhookUrl}?${params.toString()}`;
    console.log('Sending GET request to:', urlWithParams);
    
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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
