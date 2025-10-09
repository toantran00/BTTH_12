package vn.iotstar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Main controller for handling root requests
 */
@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/chat.html";
    }
    
    @GetMapping("/index")
    public String index() {
        return "redirect:/chat.html";
    }
}