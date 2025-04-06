
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
    
    const queryParams = new URLSearchParams();
    queryParams.append('data', JSON.stringify(formData));
    
    const response = await fetch(`${webhookUrl}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
    
    console.log('Webhook response:', await response.text());
    return true;
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    throw error;
  }
};
