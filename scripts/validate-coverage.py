import argparse
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(
    description='Validate de coverage for a lcov.')
parser.add_argument('--path', help='Path to index.html lcov file')

args = vars(parser.parse_args())

rulers = {
    'Statements': 65,
    'Branches': 40,
    'Functions': 50,
    'Lines': 65
}
# ../coverage/lcov-report/index.html

if(args['path'] != None):

    with open(args['path'], 'r') as t:
        content = t.read()
    soup = BeautifulSoup(content, features="html.parser")

    divs = soup.find_all(class_='space-right2')
    for div in divs:
        tag = div.find(class_='quiet').text
        value = float(div.find(class_='strong').text.replace('%', ''))

        prev_value = rulers[tag]
        if(value < prev_value):
            print(tag, 'Invalid')
            exit(1)
