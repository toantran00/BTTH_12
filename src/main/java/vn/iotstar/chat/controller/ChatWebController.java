package vn.iotstar.chat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Web controller for customer support chat pages
 */
@Controller
public class ChatWebController {

    @GetMapping("/support")
    public String supportChat() {
        return "redirect:/chat.html";
    }
    
    @GetMapping("/chat")
    public String chat() {
        return "redirect:/chat.html";
    }
}