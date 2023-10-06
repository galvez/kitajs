import type { Provider } from '@kitajs/common';
import type ts from 'typescript';
import { Parser } from './parser';

/** A route parser is responsible for parsing a node into a route. */
export interface ProviderParser extends Parser<ts.SourceFile, Provider> {}