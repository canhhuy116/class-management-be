import {
  Body,
  Controller,
  Get,
  Headers,
  ParseArrayPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { GradeCompositionUseCase } from 'application/usecases/GradeCompositionUseCase';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreateGradeCompositionVM } from 'presentation/view-model/gradecompositions/CreateGradeCompositionVM';
import { GradeCompositionVM } from 'presentation/view-model/gradecompositions/GradeCompositionVM';

@ApiBearerAuth()
@ApiTags('GradeComposition')
@Controller('api/v1/grade-composition')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccessInterceptor)
export class GradeCompositionController {
  constructor(
    private readonly gradeCompositionUseCase: GradeCompositionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Gets grade composition',
  })
  async showGradeComposition(@Headers('class-id') currentClassId: number) {
    const gradeCompositions =
      await this.gradeCompositionUseCase.showGradeComposition(
        parseInt(currentClassId.toString()),
      );

    return new SuccessResponseDTO({
      message: 'Grade composition founded',
      metadata: gradeCompositions.map((gradeComposition) =>
        GradeCompositionVM.toViewModel(gradeComposition),
      ),
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Creates grade composition',
  })
  @ApiCreatedResponse({ description: 'grade composition created.' })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating grade composition',
    type: UnprocessableEntityError,
  })
  @ApiBody({ type: [CreateGradeCompositionVM] })
  @UseGuards(TeacherRoleGuard)
  async createGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Body(new ParseArrayPipe({ items: CreateGradeCompositionVM }))
    createGrandeCompositionVM: CreateGradeCompositionVM[],
  ) {
    await this.gradeCompositionUseCase.addGradeComposition(
      createGrandeCompositionVM.map((vm) =>
        CreateGradeCompositionVM.fromViewModel(vm, currentClassId),
      ),
    );

    return new SuccessResponseDTO({
      message: 'Grade composition created',
      metadata: {},
    });
  }
}
