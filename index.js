'use strict';

const { execFileSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');
const mem = require('mem');

const shellVar = name => name.startsWith('$') ? name : `$${name}`;

/**
 * Synchronously gets default shell profile path
 * @name getProfilePath
 * @returns {Promise<String?>} profile path
 *
 * @example
 * const profile = require('shell-profile')();
 * console.log('profile: %s', profile);
 * //=> /Users/vladimyr/.zshrc
 */
module.exports = mem(function () {
  const $HOME = require('os').homedir();
  const [$BASH_VERSION, $ZSH_VERSION] = env('BASH_VERSION', 'ZSH_VERSION');
  if (/^win/gi.test(process.platform)) return;
  if ($BASH_VERSION) {
    if (existsSync(resolve($HOME, '.bashrc'))) {
      return resolve($HOME, '.bashrc');
    } else if (existsSync(resolve($HOME, '.bash_profile'))) {
      return resolve($HOME, '.bash_profile');
    }
  } else if ($ZSH_VERSION) {
    if (existsSync(resolve($HOME, '.zshrc'))) return resolve($HOME, '.zshrc');
  }
  const profiles = ['.profile', '.bashrc', '.bash_profile', '.zshrc'];
  return profiles.map(it => resolve($HOME, it)).find(it => existsSync(it));
});

function env(...vars) {
  const shellVars = vars.map(it => shellVar(it));
  const cmd = `echo -n "${shellVars.join('\n')}"; exit;`;
  const options = { stdio: 'pipe', encoding: 'utf-8' };
  const result = execFileSync(process.env.SHELL, ['-ilc', cmd], options);
  return result.trim().split('\n');
}
