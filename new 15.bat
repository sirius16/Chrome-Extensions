reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\lhbbmjhfknfomcalbplophhohboekih" -v "Path" /d "%USERPROFILE%\Google Drive\Scripts\Chrome Extensions\Pinned.crx"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\cgajadkjhmlchgmbmebjbjhgcgcnfomf" -v "Path" /d "%USERPROFILE%\Google Drive\Scripts\Chrome Extensions\Split Tabs.crx"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\klacbnfpdhmoojaehdhppmllakdelnfm" -v "Path" /d "%USERPROFILE%\Google Drive\Scripts\Chrome Extensions\Suspend Paste.crx"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\ebkmckdinpjehmlbagplhiaedpnipice" -v "Path" /d "%USERPROFILE%\Google Drive\Scripts\Chrome Extensions\Switch to OneTab.crx"

reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\lhbbmjhfknfomcalbplophhohboekih" -v "Version" /d   "2.0"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\cgajadkjhmlchgmbmebjbjhgcgcnfomf" -v "Version" /d   "1.0"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\klacbnfpdhmoojaehdhppmllakdelnfm" -v "Version" /d   "2.1"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\ebkmckdinpjehmlbagplhiaedpnipice" -v "Version" /d   "2.5"

reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\lhbbmjhfknfomcalbplophhohboekih" -v update_url /d "https://raw.githubusercontent.com/sirius16/Chrome-Extensions/master/update.xml"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\cgajadkjhmlchgmbmebjbjhgcgcnfomf" -v update_url /d "https://raw.githubusercontent.com/sirius16/Chrome-Extensions/master/update.xml"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\klacbnfpdhmoojaehdhppmllakdelnfm" -v update_url /d "https://raw.githubusercontent.com/sirius16/Chrome-Extensions/master/update.xml"
reg add "HKLM\Software\Wow6432Node\Google\Chrome\Extensions\ebkmckdinpjehmlbagplhiaedpnipice" -v update_url /d "https://raw.githubusercontent.com/sirius16/Chrome-Extensions/master/update.xml"