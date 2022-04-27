from PIL import Image, ImageDraw
import sys
from random import randrange



NUM_NODES = (int)(sys.argv[2])

path = sys.argv[1]

img = Image.open(path)
pix = img.load() #pix[x,y]
print(img.size)

xdim = img.size[0]
ydim = img.size[1]

nodes = []

for i in range(NUM_NODES):
    x = randrange(xdim)
    y = randrange(ydim)
    col = pix[x,y]
    nodes.append([x,y,col])

with open('image_data.js', 'w') as w:
    w.write('var dim = ['+str(xdim)+', '+str(ydim)+'];\n')
    w.write('var image_data = [\n')
    for n in nodes:
        w.write('\t{"x":'+str(n[0])+', "y":'+str(n[1])+', "col":['+str(n[2][0])+', '+str(n[2][1])+', '+str(n[2][2])+']},\n')
    w.write('\t{ }\n];')



