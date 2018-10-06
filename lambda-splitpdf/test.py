#!/usr/bin/env python3
import argparse
from splitPdf import split_source

parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("source_file")
parser.add_argument("save_path")
args = parser.parse_args()

source_file = args.source_file
save_path = args.save_path

split_source(source_file, save_path)
