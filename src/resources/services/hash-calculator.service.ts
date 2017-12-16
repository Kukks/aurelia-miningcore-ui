export class HashCalculatorService {

  public static HashRateUnits = [" KH/s", " MH/s", " GH/s", " TH/s", " PH/s"];
  public static DifficultyUnits = [" K", " M", " G", " T", " P"];

  public static formatHashRate(hashrate: number): string {
    let i = -1;
    do {
      hashrate = hashrate / 1024;
      i++;
    } while (hashrate > 1024 && i < HashCalculatorService.HashRateUnits.length - 1);

    return Math.abs(hashrate) + HashCalculatorService.HashRateUnits[i];
  }

  public static formatDifficulty(difficulty: number) {
    let i = -1;

    do {
      difficulty = difficulty / 1024;
      i++;
    } while (difficulty > 1024);
    return Math.abs(difficulty) + HashCalculatorService.DifficultyUnits[i];
  }
}
