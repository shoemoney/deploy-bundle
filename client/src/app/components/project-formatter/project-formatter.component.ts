import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {debounce, debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'dho-project-formatter',
  templateUrl: './project-formatter.component.html',
  styleUrls: ['./project-formatter.component.scss']
})
export class ProjectFormatterComponent implements OnInit {
  formatterForm: FormGroup;
  stackValues: string[] = [
    "Node",
    "React",
    "Angular",
    "HTML",
    "CSS",
    "SCSS",
    "JavaScript",
    "Java",
    "PHP",
    "Laravel",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Python",
    "Lua",
    "Golang",
    "C++",
    "C#",
    "DiscordJS"
  ];

  output: string;

  constructor(private readonly _fb: FormBuilder) {
  }

  get stackOptions() {
    return this.formatterForm.get('stack') as FormArray
  }

  ngOnInit() {
    this.formatterForm = this._fb.group({
      userId: ['', [Validators.required]],
      projName: ['', Validators.required],
      desc: ['', Validators.required],
      sourceUrl: ['', Validators.required],
      demoUrl: [''],
      stack: this._fb.array([]),
    });

    this.formatterForm.get('userId').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe( async change => {
      await this._validateDiscordUserName(change);
      console.log(this.formatterForm);
    });
    this._addStackOptions();
  }

  formatProject() {

    if (this.formatterForm.valid) {
      const formatedOutput: string[] = [];
      formatedOutput[0] = `@${this.formatterForm.get('userId').value}`;
      formatedOutput[1] = this._convertStacks(this.formatterForm.get('stack').value);
      formatedOutput[2] = this.formatterForm.get('projName').value;
      formatedOutput[3] = ` \`\`\` \n${this.formatterForm.get('desc').value} \n\`\`\``;
      formatedOutput[4] = `Live Demo: <${this.formatterForm.get('demoUrl').value}>`;
      formatedOutput[5] = `Source Url: <${this.formatterForm.get('sourceUrl').value}>`;

      this.output = formatedOutput.join('\n')

    }
    console.log(this.formatterForm);
  }

  submit($event) {
    $event.preventDefault();
  }

  private _addStackOptions() {
    this.stackValues.forEach(() => {
      this.stackOptions.push(this._fb.control(false));
    })
  }

  private _validateDiscordUserName(userName: string): Promise<any> {
    return new Promise<any>((res, rej) => {
      if(!/^[^@].*?#\d{4}$/g.test(userName)) {
        this.formatterForm.get('userId').setErrors({'badUserName': true });
        return res({ 'badUserName': true })
      }
      this.formatterForm.get('userId').setErrors(null);
      return res(null);
    });
  }

  private _convertStacks(stacks: boolean[]): string {
    const finalStacks: string[] = [];
    stacks.forEach((el, idx) => {
      el ? finalStacks.push(this.stackValues[idx]) : null;
    });
    return `[${finalStacks.join(' - ')}]`;
  }

}
