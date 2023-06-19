import { createMachine } from "xstate";
export const digitalBeingMachine = createMachine({
  predictableActionArguments: true,
  id: "DigitalBeingScreen",
  initial: "InitialLoad",
  states: {
    InitialLoad: {
      on: {
        ExpandAvatarProfile: "ExpandAvatarProfile",
        RecordVoice: "RecordVoice",
        TypeText: "TypeText",
        EmojiAnimatedSticker: "EmojiAnimatedSticker",
        SendAndShare: "SendAndShare",
        ExportAndViewLog: "ExportAndViewLog",
        ChooseOtherDigitalBeings: "ChooseOtherDigitalBeings",
      },
    },
    ExpandAvatarProfile: { on: { NotImplemented: "NotImplemented" } },
    NotImplemented: { on: { Return: "InitialLoad" } },
    RecordVoice: { on: { AnimateAgent: "AgentAnimation" } },
    TypeText: { on: { AnimateAgent: "AgentAnimation" } },
    EmojiAnimatedSticker: { on: { AnimateAgent: "AgentAnimation" } },
    AgentAnimation: { on: { RespondWithVoiceAndText: "AgentResponse" } },
    AgentResponse: { on: { ReturnControlFlow: "InitialLoad" } },
    SendAndShare: { on: { NotImplemented: "NotImplemented" } },
    ExportAndViewLog: {
      on: {
        NotImplemented: "NotImplemented",
        ClickConversationLog: "ConversationLog",
      },
    },
    ChooseOtherDigitalBeings: {
      on: {
        DragDropUploadVRM: "VRMDragDropUpload",
        SelectExistingAvatar: "SelectExistingAvatar",
      },
    },
    VRMDragDropUpload: { on: { Return: "InitialLoad" } },
    SelectExistingAvatar: { on: { ShowAvatarDetails: "AvatarDetails" } },
    AvatarDetails: {
      on: {
        SelectGender: "GenderSelection",
        SelectAge: "AgeSelection",
        SelectVoice: "VoiceSelection",
        ListenNextBack: "ListenNextBack",
        FactsKnowledge: "FactsKnowledge",
        SharedKnowledge: "SharedKnowledge",
        DocumentEmbedding: "DocumentEmbedding",
        applyAvatar: "InitialLoad",
      },
    },
    GenderSelection: { on: { Return: "AvatarDetails" } },
    AgeSelection: { on: { Return: "AvatarDetails" } },
    VoiceSelection: { on: { Return: "AvatarDetails" } },
    ListenNextBack: { on: { Return: "AvatarDetails" } },
    FactsKnowledge: { on: { Return: "AvatarDetails" } },
    SharedKnowledge: { on: { Return: "AvatarDetails" } },
    DocumentEmbedding: { on: { Return: "AvatarDetails" } },
    ConversationLog: {
      on: {
        ShowLastLines: "ShowLastLines",
        ScrollToStart: "ScrollToStart",
        Return: "InitialLoad",
      },
    },
    ShowLastLines: { on: { ScrollToStart: "ScrollToStart" } },
    ScrollToStart: { on: { Return: "ConversationLog" } },
  },
});
