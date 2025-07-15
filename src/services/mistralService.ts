interface MistralAgent {
    id: string;
    model: string;
    name: string;
    description: string;
    instructions: string;
    tools: Array<{ type: string }>;
}

interface MistralConversationResponse {
    conversation_id: string;
    outputs: Array<{
        type: string;
        content?: Array<{
            type: string;
            text?: string;
            tool?: string;
            file_id?: string;
            file_name?: string;
            file_type?: string;
        }>;
    }>;
}

class MistralService {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.mistral.ai/v1';
    private imageAgentId: string | null = null;

    constructor() {
        // In a real app, this would come from secure storage or environment variables
        this.apiKey = localStorage.getItem('mistral_api_key');
        this.imageAgentId = localStorage.getItem('mistral_image_agent_id');
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
        localStorage.setItem('mistral_api_key', apiKey);
        // Clear agent ID when API key changes
        this.imageAgentId = null;
        localStorage.removeItem('mistral_image_agent_id');
    }

    getApiKey(): string | null {
        return this.apiKey;
    }

    hasApiKey(): boolean {
        return !!this.apiKey;
    }

    private async createImageAgent(): Promise<string> {
        if (!this.apiKey) {
            throw new Error('Mistral API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/agents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'mistral-medium-2505',
                    name: 'Dreamy',
                    description: 'Agent specialized in generating dream-like, surreal images.',
                    instructions: `You are a Dream Visualizer Agent that transforms dream descriptions into beautiful visual artwork.

CORE BEHAVIOR:
- Generate images immediately when user shares a dream
- Focus on emotional atmosphere and surreal, dreamlike qualities
- Use atmospheric lighting, rich colors, and strong composition
- Balance realistic elements with impossible dream logic
- Keep responses brief and focused on visual aspects

COMMUNICATION STYLE:
- Warm but not overly enthusiastic
- Professional yet friendly
- Avoid cliché "magical" language
- Keep responses concise

RESPONSE FLOW:
1. Listen to dream description
2. Generate image immediately
3. Present with brief, enthusiastic comment
4. Ask if they want adjustments

VISUAL PRIORITIES:
- Capture emotional atmosphere
- Emphasize surreal, dreamlike qualities
- Use atmospheric lighting and rich colors
- Create compositionally strong images
- Focus on visual storytelling with depth and mood

When offering modifications, suggest specific improvements like adjusting lighting, color palette, perspective, or emphasizing certain elements.`,
                    tools: [{ type: 'image_generation' }],
                    completion_args: {
                        temperature: 0.7,
                        top_p: 0.9,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to create image agent: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const agent: MistralAgent = await response.json();
            this.imageAgentId = agent.id;
            localStorage.setItem('mistral_image_agent_id', agent.id);
            
            return agent.id;
        } catch (error) {
            console.error('Error creating image agent:', error);
            throw error;
        }
    }

    private async getOrCreateImageAgent(): Promise<string> {
        if (this.imageAgentId) {
            return this.imageAgentId;
        }
        
        return await this.createImageAgent();
    }

    async generateDreamImage(dreamDescription: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('Mistral API key not configured');
        }

        try {
            // Get or create the image generation agent
            const agentId = await this.getOrCreateImageAgent();

            // Enhance the dream description with artistic prompts
            const enhancedPrompt = this.enhanceDreamPrompt(dreamDescription);

            // Start a conversation with the agent
            const conversationResponse = await fetch(`${this.baseUrl}/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    agent_id: agentId,
                    inputs: `Generate a dream image: ${enhancedPrompt}`,
                    stream: false
                })
            });

            if (!conversationResponse.ok) {
                const errorData = await conversationResponse.json().catch(() => ({}));
                throw new Error(`Conversation failed: ${conversationResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const conversationData: MistralConversationResponse = await conversationResponse.json();

            // Find the file_id from the response
            let fileId: string | null = null;
            for (const output of conversationData.outputs) {
                if (output.content) {
                    for (const chunk of output.content) {
                        if (chunk.type === 'tool_file' && chunk.file_id) {
                            fileId = chunk.file_id;
                            break;
                        }
                    }
                }
                if (fileId) break;
            }

            if (!fileId) {
                throw new Error('No image file generated');
            }

            // Download the image file
            const fileResponse = await fetch(`${this.baseUrl}/files/${fileId}/content`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/octet-stream',
                }
            });

            if (!fileResponse.ok) {
                throw new Error(`Failed to download image: ${fileResponse.status}`);
            }

            // Convert the image to a blob URL for display
            const imageBlob = await fileResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            return imageUrl;

        } catch (error) {
            console.error('Error generating dream image:', error);
            throw error;
        }
    }

    private enhanceDreamPrompt(dreamDescription: string): string {
        // Enhance the dream description with artistic and surreal elements
        const artisticEnhancements = [
            'dreamlike',
            'surreal',
            'ethereal',
            'mystical',
            'cinematic lighting',
            'soft focus',
            'vibrant colors',
            'fantasy art style',
            'digital painting',
            'highly detailed',
            'atmospheric',
            'magical realism'
        ];

        const randomEnhancements = artisticEnhancements
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .join(', ');

        return `${dreamDescription}, ${randomEnhancements}, dream sequence, subconscious imagery, symbolic elements, beautiful composition, award-winning digital art`;
    }

    async testConnection(): Promise<boolean> {
        if (!this.apiKey) {
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Error testing Mistral connection:', error);
            return false;
        }
    }

    // Fallback method for when API is not available or for development
    async generateMockImage(dreamDescription: string): Promise<string> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a themed placeholder image based on dream content
        const themes = ['nature', 'space', 'abstract', 'city', 'ocean', 'forest', 'mountain', 'desert'];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        const seed = Math.floor(Math.random() * 1000);
        
        // Using Unsplash for high-quality themed images
        return `https://source.unsplash.com/800x600/?${theme},dream,surreal&sig=${seed}`;
    }
}

export const mistralService = new MistralService();
export default mistralService;
