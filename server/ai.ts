import { GoogleGenAI, Type } from '@google/genai';
import { db } from './db.js';
import { Workout, Exercise } from '../src/types/index.js';

const apiKey = process.env.GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface AICoachResponse {
  answer: string;
  recommendedWorkout?: Workout;
  recommendedExercises?: Exercise[];
  safetyTips?: string[];
}

export async function askSpotFitCoach(
  userQuery: string,
  userContext?: {
    fitnessLevel?: string;
    preferredEquipment?: string[];
    availableTimeMinutes?: number;
    currentWorkout?: Partial<Workout>;
  }
): Promise<AICoachResponse> {
  const allExercises = db.getExercises();
  const exerciseNames = allExercises.map((e) => ({
    id: e.id,
    name: e.name,
    bodyArea: e.bodyArea,
    difficulty: e.difficulty,
    equipment: e.equipment
  }));

  // Fallback intelligent responder if Gemini API key is not yet set or in offline dev
  if (!aiClient) {
    return generateFallbackCoachResponse(userQuery, userContext, allExercises);
  }

  const systemInstruction = `
You are the SpotFit AI Coach, a knowledgeable, empathetic, science-based fitness coach specializing in targeted spot training and biomechanics.

CORE PRINCIPLE & ETHICAL BOUNDARY:
- Strictly distinguish between targeted muscle training and fat loss.
- NEVER promise or imply spot fat reduction (e.g., never say "this will burn belly fat" or "tone away thigh fat"). State clearly when relevant: "While we can specifically target, strengthen, and hypertrophy this muscle group, fat loss occurs systemically through nutrition and overall caloric balance, not solely from exercising one spot."
- NEVER diagnose injuries or prescribe clinical rehabilitation. Always provide safe exercise modifications.

EXERCISE DATABASE GROUNDING:
Here is a list of available exercises in the SpotFit library:
${JSON.stringify(exerciseNames.slice(0, 60))}

When generating a workout recommendation, ONLY pick exercises from this library so the user can immediately click and start them in the interactive workout timer!

Provide a supportive, concise answer (under 160 words).
If the user asks for a workout or exercise replacement, provide structured exercises with sets, reps, and duration.
`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `User asks: "${userQuery}". Context: ${JSON.stringify(userContext || {})}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Clear, encouraging, scientifically accurate answer to the user.'
            },
            exerciseIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of matching exercise IDs from the SpotFit library (if applicable).'
            },
            suggestedWorkoutTitle: {
              type: Type.STRING,
              description: 'Title for a suggested workout routine if the user asked for one.'
            },
            estimatedMinutes: {
              type: Type.NUMBER,
              description: 'Estimated workout duration in minutes.'
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key safety considerations or form cues.'
            }
          },
          required: ['answer']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);

    let recommendedWorkout: Workout | undefined = undefined;
    let recommendedExercises: Exercise[] = [];

    if (parsed.exerciseIds && parsed.exerciseIds.length > 0) {
      recommendedExercises = parsed.exerciseIds
        .map((id: string) => allExercises.find((e) => e.id === id))
        .filter(Boolean) as Exercise[];

      if (recommendedExercises.length > 0) {
        recommendedWorkout = {
          id: `wo-ai-${Date.now()}`,
          title: parsed.suggestedWorkoutTitle || 'Custom SpotFit Routine',
          description: parsed.answer,
          bodyArea: recommendedExercises[0].bodyArea || 'full_body',
          secondaryAreas: [],
          difficulty: (userContext?.fitnessLevel as any) || 'beginner',
          durationMinutes: parsed.estimatedMinutes || 10,
          equipment: ['none'],
          trainingStyle: 'strength',
          intensity: 'moderate',
          tags: ['ai-recommended', 'custom'],
          warmup: ['Light dynamic warmup (60s)'],
          cooldown: ['Static muscle recovery stretches (60s)'],
          exercises: recommendedExercises.map((ex, idx) => ({
            exerciseId: ex.id,
            sets: 3,
            reps: ex.exerciseType === 'reps' ? ex.defaultReps : 1,
            durationSeconds: ex.duration || 30,
            restSeconds: 30,
            order: idx + 1
          }))
        };
      }
    }

    return {
      answer: parsed.answer,
      recommendedWorkout,
      recommendedExercises,
      safetyTips: parsed.safetyTips || [
        'Maintain proper posture and stop immediately if you feel sharp joint pain.'
      ]
    };
  } catch (error) {
    console.error('Error in Gemini API call, falling back to rule-based coach:', error);
    return generateFallbackCoachResponse(userQuery, userContext, allExercises);
  }
}

function generateFallbackCoachResponse(
  query: string,
  context?: { fitnessLevel?: string; preferredEquipment?: string[]; availableTimeMinutes?: number },
  allExercises: Exercise[] = db.getExercises()
): AICoachResponse {
  const q = query.toLowerCase();

  let targetArea = 'abs';
  if (q.includes('leg') || q.includes('thigh') || q.includes('quad') || q.includes('squat')) targetArea = 'thighs';
  else if (q.includes('glute') || q.includes('hip') || q.includes('butt')) targetArea = 'glutes';
  else if (q.includes('chest') || q.includes('push up') || q.includes('pushup')) targetArea = 'chest';
  else if (q.includes('back') || q.includes('posture') || q.includes('lats')) targetArea = 'back';
  else if (q.includes('shoulder') || q.includes('delt')) targetArea = 'shoulders';
  else if (q.includes('arm') || q.includes('bicep') || q.includes('tricep')) targetArea = 'arms';
  else if (q.includes('mobility') || q.includes('stretch') || q.includes('stiff')) targetArea = 'mobility';
  else if (q.includes('full body') || q.includes('hiit') || q.includes('burn')) targetArea = 'full_body';

  const matchingExercises = allExercises.filter((e) => {
    if (targetArea === 'abs') return ['abs', 'upper_abs', 'lower_abs', 'obliques', 'waist_core'].includes(e.bodyArea);
    if (targetArea === 'arms') return ['arms', 'biceps', 'triceps'].includes(e.bodyArea);
    if (targetArea === 'thighs') return ['thighs', 'hamstrings', 'calves'].includes(e.bodyArea);
    return e.bodyArea === targetArea;
  });

  const selected = matchingExercises.slice(0, 4);

  const duration = q.includes('5 min') ? 5 : q.includes('10 min') ? 10 : 15;

  let answer = `Here is a targeted ${duration}-minute routine tailored for your request. `;
  if (targetArea === 'abs') {
    answer +=
      'Remember: while this routine specifically strengthens your transverse abdominis, rectus abdominis, and obliques to build core endurance and trunk stability, fat loss occurs systemically across the whole body rather than from abdominal exercises alone.';
  } else {
    answer += `Focus on controlled tempo, steady breathing, and full range of motion. Each exercise has been selected directly from our SpotFit exercise database.`;
  }

  const workout: Workout = {
    id: `wo-coach-${Date.now()}`,
    title: `Coach's ${targetArea.toUpperCase().replace(/_/g, ' ')} Session`,
    description: answer,
    bodyArea: targetArea as any,
    secondaryAreas: [],
    difficulty: (context?.fitnessLevel as any) || 'beginner',
    durationMinutes: duration,
    equipment: ['none'],
    trainingStyle: 'strength',
    intensity: 'moderate',
    tags: ['ai-coach', targetArea],
    warmup: ['Dynamic joint preparation (60s)'],
    cooldown: ['Gentle muscle lengthening cooldown (60s)'],
    exercises: selected.map((ex, i) => ({
      exerciseId: ex.id,
      sets: duration <= 5 ? 1 : 3,
      reps: ex.exerciseType === 'reps' ? ex.defaultReps : 1,
      durationSeconds: ex.duration || 30,
      restSeconds: 30,
      order: i + 1
    }))
  };

  return {
    answer,
    recommendedWorkout: workout,
    recommendedExercises: selected,
    safetyTips: [
      'Warm up with light dynamic movement before starting.',
      'Maintain continuous rhythmic breathing; never hold your breath during holds.',
      'Stop if you experience unusual sharp pain or dizziness.'
    ]
  };
}
