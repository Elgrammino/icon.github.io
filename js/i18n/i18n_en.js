const i18n_en = {
    "translation": {
        "interface": "Calculator look",
        "interfaceNew": "iOS 26",
        "interfaceClassic": "Classic",
        "interfaceHint": "Classic matches the iPhone calculator before iOS 26. Pick it if the phone runs an older iOS.",
        "saved": "Saved. Open the calculator",
        "donate": "Support the author",
        "backToCalculator": "Calculator",
        "backToContents": "All functions",
        "ok": "OK",
        "cancel": "Not now",
        "update": "Update",
        "copyLinkHint": "Tap to copy",
        "updateAvailable": "A new version is available. Update?",
        "error": "Error",
        "newVersionAvailable": "New version installed. Read the documentation before use. Version before update: ",
        "orientationIsNotAvailable": "DD Force ON. Device orientation is not available - please use manual mode",
        "magicHistoryIsEnabled": "History ON",
        "magicHistoryIsDisabled": "History OFF",
        "magicMemoryIsEnabled": "Memory ON",
        "magicMemoryIsDisabled": "Memory OFF",
        "ddForceIsEnabled": "DD Force ON",
        "ddForceManualIsEnabled": "Manual mode ON",
        "ddForceManualDisabled": "Manual mode OFF",
        "toxicForceIsEnabled": "TOXIC Force ON",
        "history": "History",
        "dd": "Touches left",
        "alert": "Alert",
        "readme_part_1": `<div>
            <div style="text-align: center;"><strong>(⁺&frasl;₋) Remote control</strong></div>
            </div>
            <sup><strong>ATTENTION!</strong> This feature may not work on some wireless networks. Because the phones try to connect directly without an intermediary server. It is advisable that both phones are connected to the same Wi-Fi network. This increases the chances of the phones connecting successfully.</sup>
            <p>Enables/disables remote control mode. With this feature, you can control the magical functions of another similar calculator on another device remotely. To do this, you will need good, stable Internet on both devices. We will call the viewer's phone as <strong>CLIENT</strong> device. What should be done:</p>
            <ol>
            <li>First of all, it is important to enable this function once on <strong>YOUR</strong> device (or let's call it <strong>HOST</strong> phone) in order to set a unique permanent identifier for your device. This identifier can only be changed by completely reinstalling the application.</li>
            <li>Copy the <a id="link" onclick="event.preventDefault()"><strong>LINK</strong></a> link which will serve as the connection address for the <strong>CLIENT's</strong> phone. This address contains your unique permanent identifier. Therefore, if you change this <strong>ID</strong>, you will have to d all the following steps again.</li>
            <li>Use any link shortening service and make the <strong>LINK</strong> shorter</li>
            <li>You can remember the <strong>LINK</strong> or write an <strong>NFC</strong> tag</li>
            <li>The label allows you to open a <strong>LINK</strong> with a tap. If there is no label, install the application by entering the <strong>LINK&nbsp;</strong>manually</li>
            <li>From this moment on, the <strong>CLIENT</strong> will constantly try to find the <strong>HOST</strong> phone at the specified address and connect.</li>
            <li>The <strong>CLIENT</strong> calculator will work in normal calculator mode, and will secretly enable magic functions upon command from the <strong>HOST</strong> after both phones are connected</li>
            <li>On the <strong>HOST</strong> phone you need to restart the application and make sure that the remote control function is enabled</li>
            <li>On the <strong>HOST</strong> the ring around the calculator button in the top right corner turns green when the connection is established</li>
            </ol>
            <p>What do the highlight colors mean:</p>
            <ul>
            <li>History button flashes - activation/deactivation of any function in the calculator</li>
            <li>Yellow (constant) - waiting for <strong>CLIENT</strong> connection</li>
            <li>Green (constant) - connection is established, everything is fine and you can work</li>
            <li>Red (constant) - a disconnection has occurred for some reason and the application itself will try to either restore access or reboot to start the connection again. In this case, you need to manually enable the remote control function again and wait for the connection. The <strong>CLIENT's</strong> phone works offline and does not require any action</li>
            </ul>
            <p>How to control:</p>
            <p>The <strong>HOST</strong> phone controls the <strong>CLIENT</strong>. It is also desirable that notifications be allowed. Otherwise, control will not be so convenient. When the ring is green you can enable the functions: History, DD Force and TOXIC Force. Your actions will receive feedback in the form of a notification about the actions taken on the <strong>CLIENT&rsquo;s</strong> phone.</p>`,
        "readme_part_2": `<p style="text-align: center;"><strong>(%) Numerology</strong></p>
            <p>Allows you to calculate the number of fate in numerology. Enter a <strong>NUMBER</strong> and enable the function. The negative sign and fraction sign will be ignored. After enabling the function, instead of the % sign, 2 digits, for 1 second, separated by a slash, will appear.</p>
            <ul>
            <li>The top one is the number of fate, and is also the remainder of &lt;<strong>NUMBER</strong>/9&gt;. More detailed information can be found in the book Numerologic forces by Nico Heinrich</li>
            <li>The bottom one is the result of the expression &lt;9-the number of fate&gt;. This number is used to show the "Multiple of 9" effect and similar. For example. We ask the viewer to multiply the numbers randomly until we get a number with 7-9 digits. 2 multiplied by 7 multiplied by 5 multiplied, etc. different numbers every time. If the result is 122333444, and the viewer thinks the 4th digit is equal to 3, then the viewer must pronounce the numbers 1,2,2,3,3,4,4,4 (without the intended digit) in any order. By entering these numbers into the calculator and turning on the function, we will see below the number conceived by the viewer. If 9 is displayed, then the viewer could have intended either 9 or 0. To determine, use any phishing method.</li>
            </ul>
            <p>The function does not work in remote control mode for the spectator's phone.</p>`,
        "readme_part_3": `<p style="text-align: center;"><strong>(+) Toxic force</strong></p>
            <p>Enter the <strong>NUMBER</strong> and enable the function. After this, the application will wait for the = button to be pressed, and no matter what operations are calculated, the result of the calculation will always be your entered <strong>NUMBER</strong>. The example above the result stays, but its first number is quietly changed so that the example gives your <strong>NUMBER</strong>. If that would make the first number a fraction or change its sign, only the <strong>NUMBER</strong> is shown above the result.</p>
            <p>In remote control, you just need to do the same on your phone and the function will turn on on the viewer&rsquo;s device.</p>`,
        "readme_part_4": `<p style="text-align: center;"><strong>(-) DD force</strong></p>
            <p>Or display down force. Designed to force a <strong>NUMBER</strong>&nbsp;by bringing the result of calculations to the force using &ldquo;blind input of a random number&rdquo;.</p>
            <p>Enter the required <strong>NUMBER</strong> for the force and enable the function (Button = disables the function and leads to the required result):</p>
            <ul>
            <li><strong>0</strong> was entered. The result should be a number&nbsp;in the format <strong>&lt;DayMonthHoursMinutes&gt; + 1</strong> minute delay. The number is calculated based on the date/time on your device.</li>
            <li><strong>1-9</strong> was entered. The result should be a number in the format <strong>&lt;DayMonthHoursMinutes&gt; +</strong> the entered <strong>NUMBER</strong> of delay minutes. The number is calculated based on the date/time on your device.</li>
            <li><strong>Any other</strong> was entered. The result should be exactly the entered <strong>NUMBER</strong>.</li>
            </ul>
            <p>The forcing function operates in two modes:</p>
            <ul>
            <li><strong>automatic</strong> - turn the device screen down. The application automatically detects when the phone is upside down and blocks input as long as the phone is upside down.</li>
            <li><strong>manual</strong> - hold down the 0 button for 2 seconds until the history button lights up. This allows you to precisely control when the phone will block input. After turning on, the locking begins from the moment you first tap on the screen and for 10 seconds until the history button lights up again. This mode allows you to force the number by asking the viewer to close their eyes and not turn the phone over. Has priority over automatic mode.</li>
            </ul>
            <p>If the application has access (if not, then after enabling the function the application will notify about it) to the orientation of the device in space, then the mode will be <strong>automatic</strong>. At this moment, clicking on the screen causes a number to appear that is necessary to calculate the forced <strong>NUMBER</strong>. Formula: (any_calculations)&lt;any_operation&gt;X=<strong>NUMBER</strong>. Where X is the number that will be substituted for clicks on the screen. The required number is adapted to the last operation before turning the device over. But it is advisable to use + or -. In the case of the &times; and &divide; operations, the result of the calculation may not be accurate when duplicated on other calculators due to the nature of irrational numbers.</p>
            <p>If notifications are enabled or X=<strong>NUMBER</strong>, then X will be entered one digit for each touch on the screen while input is blocked. The number of required touches will be displayed in notifications if available. If not, the X will be displayed in its entirety the first time you tap on the screen.&nbsp;Each tap on the screen will trigger an animation of pressing the desired button. This allows to broadcast phone screen to a large screen on stage.</p>
            <p>In remote control mode, you get information about remaining clicks or missing permissions to access the viewer's device orientation. You can also enable "display down mode" for the viewer's phone manually or automatically if you allow access on the viewer's phone in advance if required. Similar to other features, you control when to enable this feature on the viewer's device.</p>`,
        "readme_part_5": `<p style="text-align: center;"><strong>(=)&nbsp;History peek</strong></p>
            <p>Peeking function or input history. When you first open the app, you'll be asked for permission to access your device's notifications. Depending on the answer,&nbsp;history works in two modes:</p>
            <ul>
            <li><strong>Allowed</strong> - turns on/off the history function and the application will display the history in device notifications after any actions. This allows you to get the history on your watch in real time without touching your phone.</li>
            <li><strong>Not allowed</strong> - leads to a one-time pop-up window with the input history.</li>
            </ul>
            <p>In remote control mode, turns on/off the story on the viewer&rsquo;s phone. Information will come to you in the form of notifications.</p>`,
        "readme_part_6": `<p style="text-align: center;"><strong>(.)&nbsp;Memory</strong></p>
            <p>This feature is enabled by using the fractional separator symbol, which is between <strong>0</strong> and <strong>=</strong>. All force functions operate continuously when the memory function is enabled. Even if you restart the application. After switching on/off, all forces are reset. Thus, after enabling the memory function, you also need to enable one or another force function at your discretion.</p>`,
        "readme": `<p style="text-align: center;"><strong>Copyright</strong></p>
            <p style="text-align: justify;">All content in this web application is protected by copyright law and can only be used with permission of <a href="mailto:stark1912@gmail.com">Mikhail Tsiuzhou "Michael Stark"</a> Any unauthorized copying, distribution, modification and use web application is a violation of copyright. To obtain permission to use the application or if you received the application from other sources - <a class="inline" href="mailto:stark1912@gmail.com">notify me immediately</a>, thus supporting the author's product.</p>
            <p style="text-align: center;">Description</p>
            <p style="text-align: justify;">The application is a fully working calculator with the iOS calculator interface except for the engineering mode. Automatically adapt to the locale and language of the operating system. Can be installed as an Android or iOS app, or used as a website in any browser. The application updates automatically. Does not require internet access. If the Internet is too slow and there is a delay in launching / restarting the application, turn off the Internet after the first full launch of the application. If any function does not work, delete the application, clear the site data in the browser and install the application again.</p>
            <p style="text-align: center;">Permissions</p>
            <p style="text-align: justify;">In order for the application to request the necessary permissions from the operating system, you need to click anywhere on the screen.</p>
            <p style="text-align: justify;"><span style="text-decoration: underline;">Android</span>: permission to display notifications. If enabled, the "peek" function will be displayed in the notification panel. Thus, you can receive notifications on your smart watch. Otherwise, the information will be displayed in a pop-up window.</p>
            <p style="text-align: justify;"><span style="text-decoration: underline;">iOS</span>: permission to access the device orientation for the "DD force" function. Starting with iOS 13, the application is required to request permission every time the application is launched. The permission request will only occur when the "DD force" function is enabled.</p>
            <p style="text-align: center;">Functions</p>
            <p style="text-align: justify;">Any function is activated by holding the corresponding button for 2 seconds. After that, the application will vibrate and the history button (clock) in the top left corner will light up for a moment. Vibration is not available on iOS.</p>
            <ul>
            <ul>
            <li style="text-align: justify;"><strong>(AC/C)</strong><br />Completely restarts the application and clears history.</li>
            <li style="text-align: justify;"><a href="readme.html?part=1"><strong>(⁺⁄₋) Remote control</strong></a></li>
            <li style="text-align: justify;"><a href="readme.html?part=2"><strong>(%) Numerology</strong></a></li>
            <li style="text-align: justify;"><a href="readme.html?part=3"><strong>(+) Toxic force</strong></a></li>
            <li style="text-align: justify;"><a href="readme.html?part=4"><strong>(-) DD force</strong></a></li>
            <li style="text-align: justify;"><a href="readme.html?part=5"><strong>(=) History peek</strong></a></li>
            <li style="text-align: justify;"><a href="readme.html?part=6"><strong>(.) Memory</strong></a></li>
            </ul>
            </ul>
            <p style="text-align: center;"><strong>Changelog</strong></p>
            <p style="text-align: center;"><strong>1.65</strong></p>
            <p style="text-align: center;">Fixed a bug when clearing С the value and enabling functions.</p>
            <p style="text-align: center;"><strong>1.64</strong></p>
            <p style="text-align: center;">Fixed a bug in the <strong>(.) Memory</strong> function when the phone does not recognize a display down device orientation. The request for permission to access device orientation has also been improved. Now it will not annoy you when this function is not used (iOS devices)</p>
            <p style="text-align: center;"><strong>1.63</strong></p>
            <p style="text-align: center;">Added the ability to constantly force - <strong>(.) Memory</strong> function.</p>
            <p style="text-align: center;"><strong>1.62</strong></p>
            <p style="text-align: center;">Fixed the indication of the pressed operation after the manual mode of turning the device screen down is turned on. Apple has changed its mind about disabling PWA applications.</p>
            <p style="text-align: center;"><strong>1.61</strong></p>
            <p style="text-align: center;">Apple devices running <strong>iOS 17.4</strong> have disabled the ability to install PWA applications in the EU. This means that the calculator will work as a website in a browser tab on these devices. A possible solution is to change the location of the device.</p>
            <p style="text-align: center;"><strong>1.60</strong></p>
            <p style="text-align: center;">Bug fixes and improvements</p>
            <p style="text-align: center;"><strong>1.57</strong></p>
            <p style="text-align: center;">Added the ability to remotely control the viewer's calculator</p>
            <p style="text-align: center;"><strong>1.55</strong></p>
            <p style="text-align: center;">Improved history display. Now the most recent calculations are at the top of the list. History status on/off are stored in memory. Notifications will constantly appear for every change by the user. Old notifications will be cleared. Only one notification with the current history will be displayed. Improved instructions (slightly). Improved DD Force function. Now you can broadcast your phone screen even when it is upside down. Each press will launch an animation of pressing the desired number to force. And the missing number will be recorded digitally for each click on the screen. Just turn on notifications and receive information on your watch about how many more presses are required to create the desired number for the Force.</p>
            <p style="text-align: center;"><strong>1.51</strong></p>
            <p style="text-align: center;">The logic for displaying input history has been changed. Now line breaks appear and the result of calculations is displayed.</p>
            <p style="text-align: center;"><strong>1.50</strong></p>
            <p style="text-align: center;">Improved input history display. Now, when changing the calculation operation, the history is displayed without zeros between the clicked operations. Thus, only what was clicked is displayed exactly. Also changed how history works in notifications for Android devices. If notifications are not allowed, then the history works as before - a pop-up window appears with the history. If notifications are enabled, then history works as a feature. Holding = causes the history feature to be enabled and the app will only show the history in notifications after the = button is pressed once. This allows you to get the history on your watch without touching your smartphone. Only by asking the spectator to complete the calculation by pressing =. And at that moment, the whole story will appear in the notification bar and on the watch.</p>
            <p style="text-align: center;"><strong>1.49</strong></p>
            <p style="text-align: center;">Added the ability to select a time offset from 1 to 9 minutes for a DD force</p>
            <p style="text-align: center;"><strong>1.48</strong></p>
            <p style="text-align: center;">Changed the operation of the "0" button in DD force mode.</p>`
    }
};