#!/bin/bash
rm -f .coverage.lcov || true && ./node_modules/.bin/nyc report --reporter=text-lcov | tee >(./node_modules/.bin/coveralls) .coverage.lcov | ./node_modules/.bin/codecov > /dev/null