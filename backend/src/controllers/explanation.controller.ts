import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { ExplainSchema } from '@sortd/common';

const geminiService = new GeminiService();

export class ExplanationController {
    static async explain(req: Request, res: Response) {
        try {
            // If checking multipart/form-data, req.body might contain text fields
            // and req.file might contain the image.

            const text = req.body.text;
            const file = req.file;

            let promptText = text;
            let fileInput = undefined;

            if (file) {
                // Handle text files by appending content to prompt
                if (file.mimetype.startsWith('text/') ||
                    file.mimetype === 'application/json' ||
                    file.mimetype === 'application/javascript' ||
                    file.mimetype === 'application/typescript') {

                    const fileContent = file.buffer.toString('utf-8');
                    promptText = `${promptText}\n\n[Attached File: ${file.originalname}]\n\`\`\`\n${fileContent}\n\`\`\``;
                }
                // Handle images and PDFs for multimodal
                else {
                    const base64Data = file.buffer.toString('base64');
                    fileInput = {
                        mimeType: file.mimetype,
                        data: base64Data
                    };
                }
            }

            const explanation = await geminiService.analyze(promptText, fileInput);

            res.json({
                explanation,
                suggestions: [] // Placeholder for future enhancements
            });

        } catch (error) {
            console.error('Explanation error:', error);

            res.status(500).json({ error: 'Failed to generate explanation' });
        }
    }
}
