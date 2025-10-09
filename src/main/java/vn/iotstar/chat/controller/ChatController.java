package vn.iotstar.chat.controller;

import vn.iotstar.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 * Controller class for handling customer support chat functionality.
 */
@Controller
public class ChatController {

    /**
     * Registers a user for customer support chat.
     * 
     * @param chatMessage The chat message containing the sender's information.
     * @param headerAccessor The SimpMessageHeaderAccessor object used to access session attributes.
     * @return The registered chat message.
     */
    @MessageMapping("/support.register")
    @SendTo("/topic/support")
    public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    /**
     * Sends a chat message to all connected users in customer support.
     * 
     * @param chatMessage The chat message to be sent.
     * @return The sent chat message.
     */
    @MessageMapping("/support.send")
    @SendTo("/topic/support")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }
}