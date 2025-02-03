/**
 * Model pricing from https://openai.com/api/pricing/
 */
const PRICING = {
  "gpt-4o-realtime-preview": {
    text: {
      input: 5.0,
      cached_input: 2.5,
      output: 20.0,
    },
    audio: {
      input: 40.0,
      cached_input: 2.5,
      output: 80.0,
    },
  },
  "gpt-4o-mini-realtime-preview": {
    text: {
      input: 0.6,
      cached_input: 0.3,
      output: 2.4,
    },
    audio: {
      input: 10.0,
      cached_input: 0.3,
      output: 20.0,
    },
  },
};

type AiModel = keyof typeof PRICING;

type RTCUsage = {
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  input_token_details: {
    text_tokens: number;
    audio_tokens: number;
    cached_tokens: number;
    cached_tokens_details: { text_tokens: number; audio_tokens: number };
  };
  output_token_details: {
    text_tokens: number;
    audio_tokens: number;
  };
};

export class Usage {
  public totalTokens = 0;
  public textInputTokens = 0;
  public cachedTextInputTokens = 0;
  public audioInputTokens = 0;
  public cachedAudioInputTokens = 0;
  public textOutputTokens = 0;
  public audioOutputTokens = 0;
  public cost = 0;

  constructor(public readonly model: AiModel) {}

  public add(usage?: RTCUsage) {
    if (!usage) return;

    this.totalTokens += usage.total_tokens || 0;
    this.textInputTokens += usage.input_token_details?.text_tokens || 0;
    this.cachedTextInputTokens +=
      usage.input_token_details?.cached_tokens_details?.text_tokens || 0;
    this.audioInputTokens += usage.input_token_details?.audio_tokens || 0;
    this.cachedAudioInputTokens +=
      usage.input_token_details?.cached_tokens_details?.audio_tokens || 0;
    this.textOutputTokens += usage.output_token_details?.text_tokens || 0;
    this.audioOutputTokens += usage.output_token_details?.audio_tokens || 0;

    this.calculateCost();
  }

  private calculateCost() {
    const modelPricing = PRICING[this.model];

    const textInputCost =
      (this.textInputTokens / 1e6) * modelPricing.text.input;
    const cachedTextInputCost =
      (this.cachedTextInputTokens / 1e6) * modelPricing.text.cached_input;
    const audioInputCost =
      (this.audioInputTokens / 1e6) * modelPricing.audio.input;
    const cachedAudioInputTokens =
      (this.cachedAudioInputTokens / 1e6) * modelPricing.audio.cached_input;
    const textOutputCost =
      (this.textOutputTokens / 1e6) * modelPricing.text.output;
    const audioOutputCost =
      (this.audioOutputTokens / 1e6) * modelPricing.audio.output;

    this.cost =
      textInputCost +
      cachedTextInputCost +
      audioInputCost +
      cachedAudioInputTokens +
      textOutputCost +
      audioOutputCost;
  }

  public log() {
    const formattedCost = this.cost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    console.info(
      `%c📊 Session usage (current cost: ${formattedCost}):`,
      "font-weight: bold; font-size: 14px; color: #2a9d8f;",
      this
    );
  }
}
