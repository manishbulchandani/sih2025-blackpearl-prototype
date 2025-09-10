import { useState, useEffect } from 'react';
import type { PipelineStep } from '../types/pipeline';

export const usePipelineExecution = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [forceCompleted, setForceCompleted] = useState(false);

  // Pipeline execution logic with more realistic timing
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.status === 'completed') return;

    // Update step status to running
    if (currentStep.status === 'pending') {
      setSteps(prev => prev.map((step, idx) => 
        idx === currentStepIndex 
          ? { ...step, status: 'running' as const, currentMessage: step.details[0] }
          : step
      ));
    }

    // More realistic progress simulation
    const progressInterval = setInterval(() => {
      setStepProgress(prev => {
        // Variable progress speed based on step type
        let progressIncrement = 100 / (currentStep.duration * 3); // Base increment
        
        // Different steps have different progression patterns
        if (currentStep.id === 'data-download') {
          progressIncrement = prev < 70 ? progressIncrement * 1.5 : progressIncrement * 0.5; // Fast start, slow end
        } else if (currentStep.id === 'asv-inference') {
          progressIncrement = prev < 30 ? progressIncrement * 0.7 : progressIncrement * 1.2; // Slow start, accelerate
        } else if (currentStep.id === 'novelty-detection') {
          progressIncrement = progressIncrement * 0.8; // Consistently slower
        }

        const newProgress = prev + progressIncrement;
        
        // Update current message based on progress with more realistic transitions
        const progressMilestones = [0, 25, 50, 75, 100];
        const currentMilestone = progressMilestones.findIndex(milestone => newProgress < milestone);
        const messageIndex = currentMilestone === -1 ? currentStep.details.length - 1 : currentMilestone - 1;
        const safeMessageIndex = Math.max(0, Math.min(messageIndex, currentStep.details.length - 1));
        
        setSteps(prevSteps => prevSteps.map((step, idx) => 
          idx === currentStepIndex 
            ? { ...step, progress: newProgress, currentMessage: step.details[safeMessageIndex] }
            : step
        ));

        if (newProgress >= 100) {
          // Complete current step
          setSteps(prevSteps => prevSteps.map((step, idx) => 
            idx === currentStepIndex 
              ? { ...step, status: 'completed' as const, progress: 100, currentMessage: step.details[step.details.length - 1] }
              : step
          ));
          
          // Move to next step after a realistic pause
          setTimeout(() => {
            if (currentStepIndex < steps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
              setStepProgress(0);
              setCurrentLogIndex(0);
            } else {
              // All steps completed - ensure final state is set
              setIsRunning(false);
              setStepProgress(100);
              setForceCompleted(true);
              console.log('Pipeline completed - all steps finished');
            }
          }, 2000); // 2 second pause between steps
          
          return 100;
        }
        
        return newProgress;
      });
    }, 500); // Update every 500ms for smoother animation

    return () => clearInterval(progressInterval);
  }, [isRunning, currentStepIndex, steps]);

  // More realistic log display simulation
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;
    
    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.status !== 'running') return;

    const logInterval = setInterval(() => {
      setCurrentLogIndex(prev => {
        const maxLogs = currentStep.logs.length;
        // Show logs based on progress but with some delay for realism
        const progressBasedIndex = Math.floor((stepProgress / 100) * maxLogs);
        const nextIndex = Math.min(progressBasedIndex, maxLogs - 1);
        
        // Don't show all logs immediately - stagger them
        if (nextIndex > prev) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000); // Show new log every 2 seconds

    return () => clearInterval(logInterval);
  }, [isRunning, currentStepIndex, stepProgress, steps]);

  const startPipeline = (initialSteps: PipelineStep[]) => {
    setSteps(initialSteps.map(step => ({ ...step, status: 'pending' as const, progress: 0 })));
    setCurrentStepIndex(0);
    setStepProgress(0);
    setCurrentLogIndex(0);
    setIsRunning(true);
    setForceCompleted(false);
  };

  const stopPipeline = () => {
    setIsRunning(false);
  };

  const isCompleted = steps.every(step => step.status === 'completed') || forceCompleted;
  const currentStep = steps[currentStepIndex];

  return {
    currentStepIndex,
    currentStep,
    steps,
    isRunning,
    stepProgress,
    currentLogIndex,
    isCompleted,
    startPipeline,
    stopPipeline
  };
};
