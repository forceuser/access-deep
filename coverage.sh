#!/bin/bash
rm -f .coverage.lcov
./node_modules/.bin/nyc report --reporter=text-lcov > .coverage.lcov
cat .coverage.lcov | ./node_modules/.bin/coveralls
./node_modules/.bin/codecov