import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({ userId: req.user!._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ sessions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user!._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { title = 'New Session' } = req.body;

    const session = new Session({
      userId: req.user!._id,
      title,
      chatHistory: [],
      currentComponent: {
        jsx: '// Start chatting to generate your first component!',
        css: '/* CSS will appear here */',
        generatedAt: new Date(),
      },
      componentHistory: [],
    });

    await session.save();
    res.status(201).json({ session });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message, imageUrl } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user!._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
      imageUrl,
    };
    session.chatHistory.push(userMessage);

    const currentComponent = session.currentComponent?.jsx && session.currentComponent?.css
      ? { jsx: session.currentComponent.jsx, css: session.currentComponent.css }
      : undefined;

    const aiResponse = await aiService.generateComponent(message, currentComponent);

    const assistantMessage = {
      id: uuidv4(),
      role: 'assistant' as const,
      content: aiResponse.explanation || 'Component generated successfully!',
      timestamp: new Date(),
    };
    session.chatHistory.push(assistantMessage);

    if (session.currentComponent) {
      session.componentHistory.push(session.currentComponent);
    }

    session.currentComponent = {
      jsx: aiResponse.jsx,
      css: aiResponse.css,
      generatedAt: new Date(),
    };

    await session.save();

    res.json({
      message: assistantMessage,
      component: session.currentComponent,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId: req.user!._id },
      updates,
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOneAndDelete({
      _id: sessionId,
      userId: req.user!._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
