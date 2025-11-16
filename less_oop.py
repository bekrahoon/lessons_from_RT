import re
import requests

url = "https://raw.githubusercontent.com/narmuhamedov/IT-125/master/OOP/lessonsRegular/mockdata.txt"
data = requests.get(url).text


pattern = re.compile(r"^(\w+)\t(\w+).*?\t[\w\d]+\.([\w\d]+)", re.MULTILINE)

names = []
surnames = []
types = []

for match in pattern.finditer(data):
    names.append(match.group(1))
    surnames.append(match.group(2))
    types.append(match.group(3))

with open("name.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(names))

with open("surname.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(surnames))

with open("typeFile.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(types))

print("Готово!")
