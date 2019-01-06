'use strict';

const { resolve } = require('path');
const sinon = require('sinon');
const test = require('tape');
const rewiremock = require('rewiremock/node');

const $HOME = require('os').homedir();

test('detect zsh', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.zshrc');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('\n5.2') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test('detect zsh without `.zshrc`', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.profile');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('\n5.2') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test('detect bash with `.bashrc`', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.bashrc');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('3.2.57(1)-release:5.2\n') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test('detect bash with `.bash_profile`', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.bash_profile');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('3.2.57(1)-release\n') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test('detect bash without _bash_-profile', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.profile');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('3.2.57(1)-release\n') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test('gracefull fallback to profile search', t => {
  rewiremock.enable();
  const expected = resolve($HOME, '.bashrc');
  const actual = rewiremock.proxy(() => require('./'), ({
    child_process: { execFileSync: sinon.stub().returns('\n') },
    fs: { existsSync: sinon.stub().callsFake(path => resolve(path) === expected) }
  }));
  t.plan(1);
  t.equal(actual(), expected, `profile: ${expected}`);
});

test.onFinish(() => rewiremock.disable());
