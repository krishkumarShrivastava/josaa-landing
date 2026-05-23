import requests
from bs4 import BeautifulSoup
import json
import urllib3
urllib3.disable_warnings()

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

print("Fetching initial page...")
r = s.get("https://josaa.admissions.nic.in/applicant/SeatAllotmentResult/CurrentORCR.aspx", verify=False)
soup = BeautifulSoup(r.text, 'html.parser')

viewstate = soup.find(id="__VIEWSTATE")['value']
viewstategenerator = soup.find(id="__VIEWSTATEGENERATOR")['value']
eventvalidation = soup.find(id="__EVENTVALIDATION")['value']

print("Posting Round 1...")
data = {
    '__EVENTTARGET': 'ctl00',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': viewstate,
    '__VIEWSTATEGENERATOR': viewstategenerator,
    '__EVENTVALIDATION': eventvalidation,
    'ctl00': '1',
    'ctl00': '0',
    'ctl00': '0',
    'ctl00': '0',
    'ctl00': '0',
}

r2 = s.post("https://josaa.admissions.nic.in/applicant/SeatAllotmentResult/CurrentORCR.aspx", data=data, verify=False)
soup2 = BeautifulSoup(r2.text, 'html.parser')
options = soup2.select('#ctl00_ContentPlaceHolder1_ddlInstype option')
print("Institute Types:", [o.text for o in options])

