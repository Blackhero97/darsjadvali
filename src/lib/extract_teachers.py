import json

# To'liq faylni o'qish
with open('oqituvchilar_original.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Kerakli o'qituvchilar ro'yxati
teachers = [
    "NURMUHAMMADOV H",
    "YUSUFJONOVA M", 
    "QORABOYEVA N",
    "SAMIYEVA G",
    "IBRAGIMOV S",
    "ABBOSOVA S",
    "MUSAYEVA N"
]

# Kerakli o'qituvchilarni ajratib olish
filtered_data = {}
for teacher in teachers:
    if teacher in data:
        filtered_data[teacher] = data[teacher]
        print(f"{teacher}: {len(data[teacher])} ta dars")

# Yangi faylga yozish
with open('oqituvchilar_by_name_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=2)

print(f"Jami {len(filtered_data)} ta o'qituvchi ajratildi")
