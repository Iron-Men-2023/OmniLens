#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)

import logging    
import time
import traceback
from waveshare_OLED import OLED_1in51
from PIL import Image,ImageDraw,ImageFont
logging.basicConfig(level=logging.DEBUG)
disp = OLED_1in51.OLED_1in51()
def display1(line1,line2):
    
    try:
        #disp = OLED_1in51.OLED_1in51()

        # Initialize library.
        disp.Init()
        # Clear display.
        disp.clear()

        # Create blank image for drawing.
        image1 = Image.new('1', (disp.width, disp.height), "WHITE")
        draw = ImageDraw.Draw(image1)
        font1 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 18)
        font2 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 20)
        draw.text((0,2), str(line1), font = font1, fill = 0)
        draw.text((0,20), str(line2), font = font2, fill = 0)
        image1 = image1.rotate(180) 
        disp.ShowImage(disp.getbuffer(image1))

    except IOError as e:
        logging.info(e)
        
    except KeyboardInterrupt:    
        logging.info("ctrl + c:")
        OLED_1in51.config.module_exit()
        exit()

def clear():
        disp.clear()
        
