<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * dojoless implementation : © Alena Laskavaia <laskava@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * dojoless.action.php
 *
 * dojoless main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/dojoless/dojoless/myAction.html", ...)
 *
 */
class action_dojoless extends APP_GameAction {

    // Constructor: please do not modify
    public function __default() {
        if (self::isArg('notifwindow')) {
            $this->view = "common_notifwindow";
            $this->viewArgs ['table'] = self::getArg("table", AT_posint, true);
        } else {
            $this->view = "dojoless_dojoless";
            self::trace("Complete reinitialization of board game");
        }
    }

    public function playCard() {
        self::setAjaxMode();
        $arg1 = self::getArg("card", AT_posint, false, 0);
        $this->game->action_playCard($arg1);
        self::ajaxResponse();
    }

    public function playVote() {
        self::setAjaxMode();
        $this->game->action_playVote();
        self::ajaxResponse();
    }

    public function pass() {
        self::setAjaxMode();
        $this->game->action_pass();
        self::ajaxResponse();
    }
    
    public function playSupport() {
        self::setAjaxMode();
        $this->game->action_playSupport();
        self::ajaxResponse();
    }
    public function playOppose() {
        self::setAjaxMode();
        $this->game->action_playOppose();
        self::ajaxResponse();
    }
    public function playWait() {
        self::setAjaxMode();
        $this->game->action_playWait();
        self::ajaxResponse();
    }
}
  

